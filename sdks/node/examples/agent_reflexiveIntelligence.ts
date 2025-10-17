import { Agent } from "alith";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// 🧠 Reflexive Intelligence Agent
const reflexiveAgent = new Agent({
  model: "grok-beta",
  apiKey: process.env.GROQ_API_KEY || "your-groq-api-key-here", // replace with your actual key
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
const reviewRequest = {
  code: `
    function analyzeUserData(data) {
      if (!data) return "Error: Missing input";
      return "User analysis complete";
    }
  `,
  issue: "The function does not validate data format or handle empty objects properly."
};

// Function to run the review
async function runReflexiveReview() {
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
    console.log("\n🧩 Demonstrating Reflexive Intelligence Analysis (Mock Response):");
    console.log(`
=== Code Review Analysis ===

Code Under Review:
${reviewRequest.code}

Reported Issue: ${reviewRequest.issue}

🔍 Additional Problems Identified:
1. **Type Safety**: Function doesn't validate data type or structure
2. **Security**: No input sanitization against potential malicious payloads  
3. **Error Handling**: Generic error message provides no actionable feedback
4. **Functionality**: Function always returns success regardless of data quality
5. **Logging**: No audit trail for data processing attempts

💡 Improved Implementation:
\`\`\`javascript
function analyzeUserData(data) {
  // Input validation
  if (data === null || data === undefined) {
    return { success: false, error: "Input cannot be null or undefined" };
  }
  
  if (typeof data !== 'object' || Array.isArray(data)) {
    return { success: false, error: "Input must be a valid object" };
  }
  
  if (Object.keys(data).length === 0) {
    return { success: false, error: "Input object cannot be empty" };
  }
  
  // Sanitize and validate data structure
  const sanitizedData = sanitizeUserData(data);
  
  if (!isValidDataStructure(sanitizedData)) {
    return { success: false, error: "Invalid data structure provided" };
  }
  
  // Log the analysis attempt (with privacy considerations)
  logAnalysisAttempt(sanitizedData.id || 'anonymous');
  
  return { 
    success: true, 
    message: "User analysis completed successfully",
    processedFields: Object.keys(sanitizedData).length 
  };
}

function sanitizeUserData(data) {
  // Remove potentially harmful fields
  const dangerous = ['__proto__', 'constructor', 'prototype'];
  const cleaned = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (!dangerous.includes(key) && typeof key === 'string') {
      cleaned[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  
  return cleaned;
}

function isValidDataStructure(data) {
  // Define expected structure validation
  return data && typeof data === 'object' && Object.keys(data).length > 0;
}

function logAnalysisAttempt(userId) {
  // Privacy-respecting logging
  console.log(\`Analysis attempted for user: \${userId} at \${new Date().toISOString()}\`);
}
\`\`\`

🛡️ Security & Reliability Improvements:
- **Input Validation**: Comprehensive checks for null, undefined, type, and structure
- **Prototype Pollution Protection**: Filters dangerous object properties
- **Structured Responses**: Returns objects with clear success/error states
- **Privacy-Conscious Logging**: Logs events without exposing sensitive data
- **Error Specificity**: Provides actionable error messages for debugging

🧠 Reflexive Summary:
This analysis revealed that seemingly simple functions often hide complex security and reliability concerns. The original function's brevity masked significant vulnerabilities including prototype pollution risks, poor error communication, and lack of input validation. The reflexive process showed that robust code requires anticipating edge cases, considering security implications, and designing for maintainability. Future implementations should always include comprehensive input validation, structured error handling, and privacy-conscious logging from the outset.
    `);
  }
}

// Run the agent
runReflexiveReview();
