import { Agent } from "alith";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Type definitions for the review request and response
interface ReviewRequest {
  code: string;
  issue: string;
}

interface ReviewResponse {
  success: boolean;
  message?: string;
  processedFields?: number;
  error?: string;
}

// 🧠 Reflexive Intelligence Agent
const reflexiveAgent = new Agent({
  model: "grok-beta",
  apiKey: process.env.GROQ_API_KEY || "your-groq-api-key-here", // Replace with your actual key
  baseUrl: "https://api.x.ai/v1",
  preamble: `
    You are a Reflexive Intelligence Agent — an autonomous system designed to observe, analyze, and improve your own reasoning and code structure.
    Your objectives:
    - Monitor and evaluate logical consistency, bias, and ethical soundness in AI outputs.
    - Identify inefficiencies, flaws, or inconsistencies in reasoning or code.
    - Suggest specific, actionable improvements for optimization.
    - Maintain alignment with safe and ethical AI practices.
    - Provide structured feedback with explanations for each recommendation.
  `
});

// Example user input
const reviewRequest: ReviewRequest = {
  code: `
    function analyzeUserData(data) {
      if (!data) return "Error: Missing input";
      return "User analysis complete";
    }
  `,
  issue: "The function does not validate data format or handle empty objects properly."
};

// Helper functions
function sanitizeUserData(data: Record<string, any>): Record<string, any> {
  const dangerous = ["__proto__", "constructor", "prototype"];
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (!dangerous.includes(key) && typeof key === "string") {
      cleaned[key] = typeof value === "string" ? value.trim() : value;
    }
  }

  return cleaned;
}

function isValidDataStructure(data: Record<string, any>): boolean {
  return data && typeof data === "object" && Object.keys(data).length > 0;
}

function logAnalysisAttempt(userId: string): void {
  console.log(`Analysis attempted for user: ${userId} at ${new Date().toISOString()}`);
}

// Function to analyze user data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function analyzeUserData(data: Record<string, any>): ReviewResponse {
  if (data === null || data === undefined) {
    return { success: false, error: "Input cannot be null or undefined" };
  }

  if (typeof data !== "object" || Array.isArray(data)) {
    return { success: false, error: "Input must be a valid object" };
  }

  if (Object.keys(data).length === 0) {
    return { success: false, error: "Input object cannot be empty" };
  }

  const sanitizedData = sanitizeUserData(data);

  if (!isValidDataStructure(sanitizedData)) {
    return { success: false, error: "Invalid data structure provided" };
  }

  logAnalysisAttempt(sanitizedData.id || "anonymous");

  return {
    success: true,
    message: "User analysis completed successfully",
    processedFields: Object.keys(sanitizedData).length
  };
}

// Function to run the review
async function runReflexiveReview(): Promise<void> {
  try {
    const response = await reflexiveAgent.prompt(`
      Review the following code for logical or ethical flaws.

      Code to analyze:
      ${reviewRequest.code}

      Reported issue:
      ${reviewRequest.issue}

      Tasks:
      1. Identify additional underlying problems.
      2. Suggest improvements or a rewritten version of the code.
      3. Explain how your revision improves reliability, security, or ethics.
      4. End with a short "Reflexive Summary" of what you learned.
    `);

    console.log("🧩 Reflexive Intelligence Output:\n", response);
  } catch (error: any) {
    console.log("❌ API Error:", error.message);
    console.log("\n🧩 Demonstrating Reflexive Intelligence Analysis (Mock Response):\n");

    // Mock output
    console.log(`=== Code Review Analysis ===

Code Under Review:
${reviewRequest.code}

Reported Issue: ${reviewRequest.issue}

🔍 Additional Problems Identified:
1. Type Safety: Function doesn't validate data type or structure
2. Security: No input sanitization against potential malicious payloads
3. Error Handling: Generic error message provides no actionable feedback
4. Functionality: Function always returns success regardless of data quality
5. Logging: No audit trail for data processing attempts

💡 Improved Implementation (TypeScript):
Example usage: analyzeUserData({ name: "John", email: "john@example.com" })
// See the analyzeUserData function implementation above for details

🛡️ Security & Reliability Improvements:
- Input Validation: Checks for null, undefined, type, and object structure
- Prototype Pollution Protection: Filters dangerous properties
- Structured Responses: Returns objects with clear success/error states
- Privacy-Conscious Logging: Logs events safely
- Error Specificity: Provides actionable error messages

🧠 Reflexive Summary:
Even simple functions can hide security and reliability issues. Robust implementations require input validation, structured error handling, and privacy-conscious logging.
`);
  }
}

// Demonstrate the improved function
console.log("\n🔧 Testing Improved Implementation:");
console.log("Valid data:", analyzeUserData({ name: "John", email: "john@example.com" }));
console.log("Invalid data:", analyzeUserData({}));
console.log("Null data:", analyzeUserData(null as any));

console.log("\n" + "=".repeat(50));

// Run the agent
runReflexiveReview();
