# MCP Class Examples

This repository contains simple Model Context Protocol (MCP) client and server examples for teaching purposes.

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Examples

### Option 1: Run the client (which automatically starts the server)
```bash
npm run start:client
```

This will:
- Start the MCP server
- Connect the client to the server
- Run a demonstration of available tools
- Enter interactive mode where you can test commands

### Option 2: Run server and client separately

Terminal 1 (Server):
```bash
npm run start:server
```

Terminal 2 (Client):
```bash
node client.js
```

## Available Tools

The server provides two example tools:

### 1. Calculator (`calculate`)
Performs basic arithmetic operations.

**Parameters:**
- `operation`: "add", "subtract", "multiply", "divide"
- `a`: First number
- `b`: Second number

**Example:**
```
calculate add 5 3
```

### 2. Greeter (`greet`)
Generates greeting messages in different languages.

**Parameters:**
- `name`: Name to greet
- `language`: "english", "spanish", "french" (optional, defaults to "english")

**Example:**
```
greet Alice english
greet Carlos spanish
```

## Interactive Mode Commands

When running the client, you can use these commands in interactive mode:
- `calculate add 5 3`
- `calculate multiply 7 8`
- `greet Alice english`
- `greet Bob spanish`
- `quit`

## Learning Objectives

This example demonstrates:
1. How to create a basic MCP server with tools
2. How to create an MCP client that connects to a server
3. Tool definition with input schemas
4. Error handling in MCP
5. Interactive client-server communication

## File Structure

- `server.js` - MCP server implementation with calculator and greeter tools
- `client.js` - MCP client that connects to the server and demonstrates tool usage
- `package.json` - Node.js project configuration with dependencies