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
                  content: "You are a preference parser. Given a natural language input, determine which preference field to update and the new value. Return a JSON object with 'field' and 'value' properties. Valid fields are: name, address, city, state, country, zipCode, generalPreferences, privacySettings, dataSharing, apiKeys, tokens. Format your response as a valid JSON object."
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

            // First get the current preferences
            const currentPreferences = await prisma.userPreferences.findUnique({
              where: { userId: auth.user.id },
            });
            
            console.log('Current preferences:', currentPreferences);

            // Get the current value for the field
            const currentValue = currentPreferences?.[field as keyof typeof currentPreferences] || "";
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
                  For generalPreferences, combine all preferences into a single coherent string.
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

            // Update the preference in the database with the combined value
            const updateData = {
              [field]: combinedValue,
              // Preserve other fields from current preferences
              name: field === 'name' ? combinedValue : (currentPreferences?.name ?? null),
              address: field === 'address' ? combinedValue : (currentPreferences?.address ?? null),
              city: field === 'city' ? combinedValue : (currentPreferences?.city ?? null),
              state: field === 'state' ? combinedValue : (currentPreferences?.state ?? null),
              country: field === 'country' ? combinedValue : (currentPreferences?.country ?? null),
              zipCode: field === 'zipCode' ? combinedValue : (currentPreferences?.zipCode ?? null),
              generalPreferences: field === 'generalPreferences' ? combinedValue : (currentPreferences?.generalPreferences ?? null),
              privacySettings: field === 'privacySettings' ? combinedValue : (currentPreferences?.privacySettings ?? null),
              dataSharing: field === 'dataSharing' ? combinedValue : (currentPreferences?.dataSharing ?? null),
              apiKeys: field === 'apiKeys' ? combinedValue : (currentPreferences?.apiKeys ?? null),
              tokens: field === 'tokens' ? combinedValue : (currentPreferences?.tokens ?? null),
            };
            console.log('Update data:', updateData);

            const preferences = await prisma.userPreferences.upsert({
              where: { userId: auth.user.id },
              update: updateData,
              create: {
                userId: auth.user.id,
                ...updateData
              },
            });
            console.log('Updated preferences:', preferences);

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
                    preferences,
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
                  content: "You are a preference parser. Given a natural language input, determine which preference field to clear. Return a JSON object with a 'field' property. Valid fields are: name, address, city, state, country, zipCode, generalPreferences, privacySettings, dataSharing, apiKeys, tokens. Format your response as a valid JSON object."
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
            const preferences = await prisma.userPreferences.update({
              where: { userId: auth.user.id },
              data: { [field]: "" },
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    message: `Cleared ${field}`,
                    preferences,
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
                  content: "You are a preference parser. Given a natural language input, determine which preference field to look up. Return a JSON object with a 'field' property. Valid fields are: name, address, city, state, country, zipCode, generalPreferences, privacySettings, dataSharing, apiKeys, tokens. Format your response as a valid JSON object."
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
            const preferences = await prisma.userPreferences.findUnique({
              where: { userId: auth.user.id },
            });

            if (!preferences) {
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
                    value: preferences[field as keyof typeof preferences],
                    preferences,
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
