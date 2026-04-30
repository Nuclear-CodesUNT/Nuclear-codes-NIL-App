import { Request, Response } from 'express';
import { generateSigningUrl } from '../services/docusign.js'; 
import { getValidToken } from '../middleware/docusignAuth.js'; // <-- NEW IMPORT
import path from 'path';
import fs from 'fs'; 

export const createController = async (req: Request, res: Response) => {
  console.log("--- 🚀 Request Received: Generate Signing URL ---");

  // 1. Extract Env Variables safely (Updated for JWT)
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
  const clientId = process.env.DOCUSIGN_APPLICATION_KEY;
  const userId = process.env.DOCUSIGN_IMPERSONATED_USER_ID;

  // --- DEBUG LOGGING ---
  console.log(`> Account ID: ${accountId ? '✅ Found' : '❌ MISSING'}`);
  console.log(`> Client ID: ${clientId ? '✅ Found' : '❌ MISSING'}`);
  console.log(`> User ID: ${userId ? '✅ Found' : '❌ MISSING'}`);
  
  // 2. Fail fast if ANY JWT keys are missing
  if (!accountId || !clientId || !userId) {
    console.error("❌ ERROR: Missing DocuSign JWT credentials in .env file");
    return res.status(500).json({ 
      error: 'Missing DocuSign credentials in .env file',
      details: 'Check your .env file for DOCUSIGN_ACCOUNT_ID, DOCUSIGN_CLIENT_ID, and DOCUSIGN_IMPERSONATED_USER_ID'
    });
  }

  // 3. Pre-flight check for the PDF file
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
    // 4. Get a valid JWT Token (cached or fresh)
    const accessToken = await getValidToken();
    console.log(`✅ Access Token Acquired (Length: ${accessToken.length})`);

    console.log("> Calling DocuSign API...");
    const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:3000';
    // 5. Call your helper function using the dynamic token
    const url = await generateSigningUrl(
      accessToken, 
      accountId,
      {
        signerEmail: 'user@example.com', 
        signerName: 'John Doe',
        userClientId: '1001',
        documentPath: 'files/contract.pdf',
        returnUrl: `${FRONTEND_URL}/contracts?status=signed`
      }
    );
    
    console.log("✅ SUCCESS: Signing URL generated!");
    
    // 6. Return the URL
    res.json({ signingUrl: url });

  } catch (error: any) {
    // --- ENHANCED ERROR LOGGING ---
    console.error('--- ❌ CRITICAL DOCUSIGN ERROR ---');
    console.error('Message:', error.message);
    
    if (error.response && error.response.body) {
      console.error('API Error Body:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error('Stack Trace:', error.stack);
    }

    res.status(500).json({
      error: 'Error generating signing URL',
      message: error.message,
      apiBody: error.response?.body || 'No API details available'
    });
  }
};