import { withAuthkit } from "@/lib/with-authkit";
import createMcpHandler from "@vercel/mcp-adapter/next";
import { z } from "zod";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Temporary debug user ID
const DEBUG_USER_ID = "debug-user-123";

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
                  content: "You are a preference parser. Given a natural language input, determine which preference field to update and the new value. Return a JSON object with 'field' and 'value' properties. Valid fields are: name, language, tone, interests, apiKey."
                },
                {
                  role: "user",
                  content: args.naturalLanguageInput
                }
              ],
              response_format: { type: "json_object" }
            });

            const parsedResponse = JSON.parse(completion.choices[0].message.content);
            const { field, value } = parsedResponse;

            // Update the preference in the database
            const preferences = await prisma.userPreferences.upsert({
              where: { userId: DEBUG_USER_ID },
              update: updateData,
              create: {
                userId: DEBUG_USER_ID,
                ...updateData
              },
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    message: `Updated ${field} to "${value}"`,
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
                  content: "You are a preference parser. Given a natural language input, determine which preference field to clear. Return a JSON object with a 'field' property. Valid fields are: name, language, tone, interests, apiKey."
                },
                {
                  role: "user",
                  content: args.naturalLanguageInput
                }
              ],
              response_format: { type: "json_object" }
            });

            const parsedResponse = JSON.parse(completion.choices[0].message.content);
            const { field } = parsedResponse;

            // Clear the preference in the database
            const preferences = await prisma.userPreferences.update({
              where: { userId: DEBUG_USER_ID },
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
                  content: "You are a preference parser. Given a natural language input, determine which preference field to look up. Return a JSON object with a 'field' property. Valid fields are: name, language, tone, interests, apiKey."
                },
                {
                  role: "user",
                  content: args.naturalLanguageInput
                }
              ],
              response_format: { type: "json_object" }
            });

            const parsedResponse = JSON.parse(completion.choices[0].message.content);
            const { field } = parsedResponse;

            // Get the preference from the database
            const preferences = await prisma.userPreferences.findUnique({
              where: { userId: DEBUG_USER_ID },
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
                    value: preferences[field],
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
