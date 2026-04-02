import { Request, Response } from 'express';
import { generateSigningUrl } from '../services/docusign.js'; 
import path from 'path';
import fs from 'fs'; // Added for file check

export const createController = async (req: Request, res: Response) => {
  console.log("--- 🚀 Request Received: Generate Signing URL ---");

  // 1. Extract Env Variables safely
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
  const accessToken = process.env.DOCUSIGN_APPLICATION_KEY; 

  // --- DEBUG LOGGING (Check your terminal for this!) ---
  console.log(`> Account ID: ${accountId ? '✅ Found' : '❌ MISSING'}`);
  console.log(`> Access Token: ${accessToken ? `✅ Found (Length: ${accessToken.length})` : '❌ MISSING'}`);
  
  // 2. Fail fast if keys are missing
  if (!accountId || !accessToken) {
    console.error("❌ ERROR: Missing DocuSign credentials in .env file");
    return res.status(500).json({ 
      error: 'Missing DocuSign credentials in .env file',
      details: 'Check your .env file for DOCUSIGN_ACCOUNT_ID and DOCUSIGN_APPLICATION_KEY'
    });
  }

  // 3. Pre-flight check for the PDF file
  // This catches the most common "500 Error" where the file path is wrong
  const absolutePath = path.resolve(process.cwd(), 'files/contract.pdf');
  console.log(`> Looking for file at: ${absolutePath}`);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ ERROR: File NOT found at ${absolutePath}`);
    return res.status(500).json({
      error: 'PDF File Missing',
      details: `Could not find file at: ${absolutePath}. Check your 'files' folder.`
    });
  }

  try {
    console.log("> Calling DocuSign API...");
    
    // 4. Call your helper function
    const url = await generateSigningUrl(
      accessToken, 
      accountId,
      {
        signerEmail: 'user@example.com', 
        signerName: 'John Doe',
        userClientId: '1001',
        documentPath: 'files/contract.pdf', // Ensure this matches the check above
        returnUrl: 'http://localhost:3000/contracts?status=signed'
      }
    );
    
    console.log("✅ SUCCESS: Signing URL generated!");
    
    // 5. Return the URL
    res.json({ signingUrl: url });

  } catch (error: any) {
    // --- ENHANCED ERROR LOGGING ---
    console.error('--- ❌ CRITICAL DOCUSIGN ERROR ---');
    console.error('Message:', error.message);
    
    // If it's a DocuSign API error, it often hides details inside 'response.body'
    if (error.response && error.response.body) {
      console.error('API Error Body:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error('Stack Trace:', error.stack);
    }

    // Send the REAL error back to the frontend so you can see it
    res.status(500).json({
      error: 'Error generating signing URL',
      message: error.message,
      apiBody: error.response?.body || 'No API details available'
    });
  }
};