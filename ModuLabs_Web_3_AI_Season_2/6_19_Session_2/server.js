#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

class TeachingMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "teaching-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "calculate",
            description: "Perform basic arithmetic calculations",
            inputSchema: {
              type: "object",
              properties: {
                operation: {
                  type: "string",
                  enum: ["add", "subtract", "multiply", "divide"],
                  description: "The arithmetic operation to perform"
                },
                a: {
                  type: "number",
                  description: "First number"
                },
                b: {
                  type: "number",
                  description: "Second number"
                }
              },
              required: ["operation", "a", "b"]
            }
          },
          {
            name: "greet",
            description: "Generate a greeting message",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name to greet"
                },
                language: {
                  type: "string",
                  enum: ["english", "spanish", "french"],
                  description: "Language for greeting",
                  default: "english"
                }
              },
              required: ["name"]
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (name === "calculate") {
          const { operation, a, b } = args;
          let result;

          switch (operation) {
            case "add":
              result = a + b;
              break;
            case "subtract":
              result = a - b;
              break;
            case "multiply":
              result = a * b;
              break;
            case "divide":
              if (b === 0) {
                throw new Error("Division by zero is not allowed");
              }
              result = a / b;
              break;
            default:
              throw new Error(`Unknown operation: ${operation}`);
          }

          return {
            content: [
              {
                type: "text",
                text: `Result: ${a} ${operation} ${b} = ${result}`
              }
            ]
          };
        }

        if (name === "greet") {
          const { name: personName, language = "english" } = args;
          const greetings = {
            english: `Hello, ${personName}! Welcome to MCP!`,
            spanish: `¡Hola, ${personName}! ¡Bienvenido a MCP!`,
            french: `Bonjour, ${personName}! Bienvenue à MCP!`
          };

          return {
            content: [
              {
                type: "text",
                text: greetings[language] || greetings.english
              }
            ]
          };
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Teaching MCP Server running on stdio");
  }
}

const server = new TeachingMCPServer();
server.run().catch(console.error);