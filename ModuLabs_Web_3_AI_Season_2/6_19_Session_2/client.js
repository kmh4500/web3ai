#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import natural from 'natural';
import nlp from 'compromise';

class TeachingMCPClient {
  constructor() {
    this.client = new Client(
      {
        name: "teaching-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {}
      }
    );
    
    this.setupNLP();
    this.conversationContext = [];
  }

  setupNLP() {
    this.intentClassifier = new natural.BayesClassifier();
    
    this.intentClassifier.addDocument('add 5 and 3', 'calculate');
    this.intentClassifier.addDocument('multiply 7 by 8', 'calculate');
    this.intentClassifier.addDocument('what is 10 plus 20', 'calculate');
    this.intentClassifier.addDocument('subtract 15 from 30', 'calculate');
    this.intentClassifier.addDocument('divide 100 by 4', 'calculate');
    this.intentClassifier.addDocument('calculate the sum of 2 and 8', 'calculate');
    this.intentClassifier.addDocument('compute 12 times 3', 'calculate');
    this.intentClassifier.addDocument('find the difference between 50 and 25', 'calculate');
    
    this.intentClassifier.addDocument('say hello to Alice', 'greet');
    this.intentClassifier.addDocument('greet Bob in Spanish', 'greet');
    this.intentClassifier.addDocument('hello there John', 'greet');
    this.intentClassifier.addDocument('introduce yourself to Maria', 'greet');
    this.intentClassifier.addDocument('welcome Sarah', 'greet');
    this.intentClassifier.addDocument('say hi to everyone', 'greet');
    
    this.intentClassifier.addDocument('exit', 'quit');
    this.intentClassifier.addDocument('goodbye', 'quit');
    this.intentClassifier.addDocument('stop', 'quit');
    this.intentClassifier.addDocument('end', 'quit');
    this.intentClassifier.addDocument('bye', 'quit');
    
    this.intentClassifier.train();
  }

  extractParameters(text, intent) {
    const doc = nlp(text);
    
    if (intent === 'calculate') {
      // Try multiple approaches to extract numbers
      let numbers = doc.match('#Value').out('number');
      console.log('Numbers from compromise:', numbers);
      
      // Convert string to array if needed
      if (typeof numbers === 'string') {
        numbers = numbers.split(' ').filter(n => n.trim());
      }
      
      // Fallback: use regex to find numbers if compromise fails
      if (!Array.isArray(numbers) || numbers.length < 2) {
        const numberMatches = text.match(/\d+(?:\.\d+)?/g);
        console.log('Numbers from regex:', numberMatches);
        if (numberMatches) {
          numbers = numberMatches;
        }
      }
      
      const operations = {
        'add': ['add', 'plus', 'sum', 'total'],
        'subtract': ['subtract', 'minus', 'difference', 'take away'],
        'multiply': ['multiply', 'times', 'product', 'by'],
        'divide': ['divide', 'divided by', 'quotient']
      };
      
      let operation = 'add';
      for (const [op, keywords] of Object.entries(operations)) {
        if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
          operation = op;
          break;
        }
      }
      
      console.log('Extracted parameters:', { operation, numbers, a: numbers[0], b: numbers[1] });
      
      if (numbers.length >= 2) {
        return {
          operation,
          a: parseFloat(numbers[0]),
          b: parseFloat(numbers[1])
        };
      }
    }
    
    if (intent === 'greet') {
      const names = doc.match('#Person').out('text');
      console.log('Names from compromise:', names);
      
      // Fallback: try to extract names manually if compromise fails
      let extractedName = 'friend';
      if (Array.isArray(names) && names.length > 0) {
        extractedName = names[0];
      } else if (typeof names === 'string' && names.trim()) {
        extractedName = names.trim();
      } else {
        // Try to find capitalized words that might be names
        const words = text.split(' ');
        const capitalizedWords = words.filter(word => 
          word.length > 1 && 
          word[0] === word[0].toUpperCase() && 
          word.toLowerCase() !== 'hi' && 
          word.toLowerCase() !== 'hello' &&
          word.toLowerCase() !== 'say' &&
          word.toLowerCase() !== 'greet'
        );
        if (capitalizedWords.length > 0) {
          extractedName = capitalizedWords[0];
        }
      }
      
      // Capitalize the first letter of the name
      if (extractedName && extractedName !== 'friend') {
        extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
      }
      
      const languages = ['english', 'spanish', 'french'];
      let language = 'english';
      
      for (const lang of languages) {
        if (text.toLowerCase().includes(lang)) {
          language = lang;
          break;
        }
      }
      
      console.log('Extracted greeting parameters:', { name: extractedName, language });
      
      return {
        name: extractedName,
        language
      };
    }
    
    return {};
  }

  async connect() {
    const transport = new StdioClientTransport({
      command: "node",
      args: ["./server.js"]
    });

    await this.client.connect(transport);
    console.log("Connected to MCP server!");

    process.on("SIGINT", () => {
      process.exit(0);
    });

    return transport;
  }

  async demonstrateTools() {
    console.log("\n=== MCP Client Demo ===\n");

    try {
      console.log("1. Listing available tools...");
      const tools = await this.client.listTools();
      console.log("Available tools:", tools.tools.map(t => t.name).join(", "));
      console.log();

      console.log("2. Testing calculator tool...");
      const calcResult = await this.client.callTool({
        name: "calculate",
        arguments: {
          operation: "add",
          a: 15,
          b: 27
        }
      });
      console.log("Calculator result:", calcResult.content[0].text);
      console.log();

      console.log("3. Testing greeting tool...");
      const greetResult = await this.client.callTool({
        name: "greet",
        arguments: {
          name: "Students",
          language: "english"
        }
      });
      console.log("Greeting result:", greetResult.content[0].text);
      console.log();

      console.log("4. Testing greeting in Spanish...");
      const spanishGreet = await this.client.callTool({
        name: "greet",
        arguments: {
          name: "Estudiantes",
          language: "spanish"
        }
      });
      console.log("Spanish greeting:", spanishGreet.content[0].text);
      console.log();

      console.log("5. Testing division...");
      const divResult = await this.client.callTool({
        name: "calculate",
        arguments: {
          operation: "divide",
          a: 100,
          b: 4
        }
      });
      console.log("Division result:", divResult.content[0].text);
      console.log();

      console.log("6. Testing error handling (division by zero)...");
      const errorResult = await this.client.callTool({
        name: "calculate",
        arguments: {
          operation: "divide",
          a: 10,
          b: 0
        }
      });
      console.log("Error result:", errorResult.content[0].text);
      console.log();

    } catch (error) {
      console.error("Demo error:", error);
    }
  }

  async runInteractiveMode() {
    console.log("\n=== Interactive Mode with Natural Language Understanding ===");
    console.log("Try natural language commands like:");
    console.log("- 'What is 15 plus 27?'");
    console.log("- 'Multiply 7 by 8'");
    console.log("- 'Say hello to Alice'");
    console.log("- 'Greet Bob in Spanish'");
    console.log("- 'goodbye' or 'quit'");
    console.log();

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question('> ', async (input) => {
        const trimmedInput = input.trim();
        
        if (!trimmedInput) {
          askQuestion();
          return;
        }

        this.conversationContext.push({ user: trimmedInput, timestamp: Date.now() });
        
        const intent = this.intentClassifier.classify(trimmedInput);
        
        if (intent === 'quit') {
          console.log("Goodbye!");
          rl.close();
          return;
        }

        try {
          const params = this.extractParameters(trimmedInput, intent);
          
          if (intent === 'calculate' && params.operation && params.a !== undefined && params.b !== undefined) {
            const result = await this.client.callTool({
              name: "calculate",
              arguments: params
            });
            const response = result.content[0].text;
            console.log(response);
            this.conversationContext.push({ assistant: response, timestamp: Date.now() });
            
          } else if (intent === 'greet' && params.name) {
            const result = await this.client.callTool({
              name: "greet",
              arguments: params
            });
            const response = result.content[0].text;
            console.log(response);
            this.conversationContext.push({ assistant: response, timestamp: Date.now() });
            
          } else {
            const suggestions = this.getSuggestions(trimmedInput);
            console.log(`I didn't understand that. ${suggestions}`);
          }
        } catch (error) {
          console.error("Error:", error.message);
        }

        askQuestion();
      });
    };

    askQuestion();
  }

  getSuggestions(input) {
    const similarities = {
      calculate: natural.JaroWinklerDistance(input.toLowerCase(), 'calculate'),
      greet: natural.JaroWinklerDistance(input.toLowerCase(), 'greet'),
      math: natural.JaroWinklerDistance(input.toLowerCase(), 'math'),
      hello: natural.JaroWinklerDistance(input.toLowerCase(), 'hello')
    };
    
    const bestMatch = Object.entries(similarities).reduce((a, b) => 
      similarities[a[0]] > similarities[b[0]] ? a : b
    );
    
    if (bestMatch[1] > 0.6) {
      if (bestMatch[0] === 'calculate' || bestMatch[0] === 'math') {
        return "Try something like: 'What is 5 plus 3?' or 'Multiply 7 by 8'";
      } else if (bestMatch[0] === 'greet' || bestMatch[0] === 'hello') {
        return "Try something like: 'Say hello to Alice' or 'Greet Bob in Spanish'";
      }
    }
    
    return "Try asking me to calculate something or greet someone!";
  }
}

async function main() {
  const client = new TeachingMCPClient();
  
  try {
    const transport = await client.connect();
    
    await client.demonstrateTools();
    
    await client.runInteractiveMode();
    
  } catch (error) {
    console.error("Client error:", error);
    process.exit(1);
  }
}

main();