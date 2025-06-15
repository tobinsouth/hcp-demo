import { withAuthkit } from "@/lib/with-authkit";
import createMcpHandler from "@vercel/mcp-adapter/next";
import { z } from "zod";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler = withAuthkit((request, auth) =>
  createMcpHandler(
    (server) => {
      server.tool(
        "addPreference",
        "Adds or updates a user preference based on natural language input. " +
        "The tool uses OpenAI to understand the intent and update the appropriate preference field. " +
        "Example: 'I prefer to be called John' would update the name field.",
        {
          naturalLanguageInput: z.string().describe("The natural language input describing the preference to add or update"),
        },
        async (args) => {
          try {
            // Use OpenAI to understand the intent
            const completion = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: "You are a preference parser. Given a natural language input, determine which preference field to update and the new value. Return a JSON object with 'field' and 'value' properties. Valid fields are: name, location, publicProfile, privateProfile, memories, privatePreferences, secureInfo, customRules. Format your response as a valid JSON object."
                },
                {
                  role: "user",
                  content: args.naturalLanguageInput
                }
              ]
            });

            const content = completion.choices[0].message.content;
            if (!content) {
              throw new Error("No response from OpenAI");
            }

            let parsedResponse;
            try {
              parsedResponse = JSON.parse(content);
            } catch (e) {
              throw new Error("Failed to parse OpenAI response as JSON", { cause: e });
            }

            const { field, value } = parsedResponse;

            // First get the current context
            const currentContext = await prisma.HumanContext.findUnique({
              where: { id: auth.user.id },
            });
            
            console.log('Current context:', currentContext);

            // Get the current value for the field
            const currentValue = currentContext?.[field as keyof typeof currentContext] || "";
            console.log('Current value for field:', field, currentValue);

            // Use OpenAI to combine the current and new preferences
            const combineCompletion = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: `You are a preference combiner. Given a current preference text and a new preference, combine them into a single coherent preference text. 
                  If the current text is empty, just use the new preference.
                  If both exist, intelligently combine them while maintaining all important information.
                  For privatePreferences, combine all preferences into a single coherent string.
                  Return only the combined text, no explanation or JSON.`
                },
                {
                  role: "user",
                  content: `Current ${field}: "${currentValue}"\nNew ${field}: "${value}"`
                }
              ]
            });

            const combinedValue = combineCompletion.choices[0].message.content?.trim() || value;
            console.log('Combined value:', combinedValue);

            // Update the context in the database with the combined value
            const updateData = {
              [field]: combinedValue,
              // Preserve other fields from current context
              name: field === 'name' ? combinedValue : (currentContext?.name ?? null),
              location: field === 'location' ? combinedValue : (currentContext?.location ?? null),
              publicProfile: field === 'publicProfile' ? combinedValue : (currentContext?.publicProfile ?? null),
              privateProfile: field === 'privateProfile' ? combinedValue : (currentContext?.privateProfile ?? null),
              memories: field === 'memories' ? combinedValue : (currentContext?.memories ?? null),
              privatePreferences: field === 'privatePreferences' ? combinedValue : (currentContext?.privatePreferences ?? null),
              secureInfo: field === 'secureInfo' ? combinedValue : (currentContext?.secureInfo ?? null),
              customRules: field === 'customRules' ? combinedValue : (currentContext?.customRules ?? null),
            };
            console.log('Update data:', updateData);

            const context = await prisma.HumanContext.upsert({
              where: { id: auth.user.id },
              update: updateData,
              create: {
                id: auth.user.id,
                ...updateData
              },
            });
            console.log('Updated context:', context);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    message: `Updated ${field} to "${combinedValue}"`,
                    previousValue: currentValue,
                    newValue: value,
                    combinedValue,
                    context,
                  }),
                },
              ],
            };
          } catch (e) {
            console.error("Error updating preference:", e);
            return {
              content: [
                {
                  type: "text",
                  text: "Failed to update preference. Please try again.",
                },
              ],
            };
          }
        },
      );

      server.tool(
        "removePreference",
        "Removes or clears a specific preference based on natural language input. " +
        "The tool uses OpenAI to understand which preference to remove. " +
        "Example: 'Remove my API key' would clear the apiKey field.",
        {
          naturalLanguageInput: z.string().describe("The natural language input describing the preference to remove"),
        },
        async (args) => {
          try {
            // Use OpenAI to understand the intent
            const completion = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: "You are a preference parser. Given a natural language input, determine which preference field to clear. Return a JSON object with a 'field' property. Valid fields are: name, location, publicProfile, privateProfile, memories, privatePreferences, secureInfo, customRules. Format your response as a valid JSON object."
                },
                {
                  role: "user",
                  content: args.naturalLanguageInput
                }
              ]
            });

            const content = completion.choices[0].message.content;
            if (!content) {
              throw new Error("No response from OpenAI");
            }

            let parsedResponse;
            try {
              parsedResponse = JSON.parse(content);
            } catch (e) {
              throw new Error("Failed to parse OpenAI response as JSON", { cause: e });
            }

            const { field } = parsedResponse;

            // Clear the preference in the database
            const context = await prisma.HumanContext.update({
              where: { id: auth.user.id },
              data: { [field]: "" },
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    message: `Cleared ${field}`,
                    context,
                  }),
                },
              ],
            };
          } catch (e) {
            console.error("Error removing preference:", e);
            return {
              content: [
                {
                  type: "text",
                  text: "Failed to remove preference. Please try again.",
                },
              ],
            };
          }
        },
      );

      server.tool(
        "findPreference",
        "Searches for preferences based on natural language input. " +
        "The tool uses OpenAI to understand what information to look for. " +
        "Example: 'What language do I prefer?' would return the language preference.",
        {
          naturalLanguageInput: z.string().describe("The natural language input describing what preference to find"),
        },
        async (args) => {
          try {
            // Use OpenAI to understand the intent
            const completion = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: "You are a preference parser. Given a natural language input, determine which preference field to look up. Return a JSON object with a 'field' property. Valid fields are: name, location, publicProfile, privateProfile, memories, privatePreferences, secureInfo, customRules. Format your response as a valid JSON object."
                },
                {
                  role: "user",
                  content: args.naturalLanguageInput
                }
              ]
            });

            const content = completion.choices[0].message.content;
            if (!content) {
              throw new Error("No response from OpenAI");
            }

            let parsedResponse;
            try {
              parsedResponse = JSON.parse(content);
            } catch (e) {
              throw new Error("Failed to parse OpenAI response as JSON", { cause: e });
            }

            const { field } = parsedResponse;

            // Get the preference from the database
            const context = await prisma.HumanContext.findUnique({
              where: { id: auth.user.id },
            });

            if (!context) {
              return {
                content: [
                  {
                    type: "text",
                    text: "No preferences found.",
                  },
                ],
              };
            }

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    field,
                    value: context[field as keyof typeof context],
                    context,
                  }),
                },
              ],
            };
          } catch (e) {
            console.error("Error finding preference:", e);
            return {
              content: [
                {
                  type: "text",
                  text: "Failed to find preference. Please try again.",
                },
              ],
            };
          }
        },
      );
    },
    {
      // Optional server options
    },
    {
      // Optional configuration
      streamableHttpEndpoint: "/mcp",
      sseEndpoint: "/sse",
      maxDuration: 600,
      verboseLogs: true,
    },
  )(request),
);

export { handler as GET, handler as POST };
