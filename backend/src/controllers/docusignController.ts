import { Request, Response } from 'express';
import { generateSigningUrl } from '../services/docusign.js'; // Import the function
import path from 'path';

const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID
const accessToken = process.env.DOCUSIGN_APPLICATION_KEY
// process.cwd() gets the root folder where you started the app
const pdfPath = path.resolve(process.cwd(), 'files/contract.pdf');

export const createController = async (req: Request, res: Response) => {
  // 1. Extract Env Variables safely
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
  const accessToken = process.env.DOCUSIGN_APPLICATION_KEY; // Make sure this is the LONG string

  // 2. Fail fast if keys are missing (Good practice!)
  if (!accountId || !accessToken) {
    return res.status(500).json({ 
      error: 'Missing DocuSign credentials in .env file' 
    });
  }

  try {
    // 3. Call your helper function
    const url = await generateSigningUrl(
      accessToken, 
      accountId,
      {
        signerEmail: 'user@example.com', // In a real app, get this from req.body
        signerName: 'John Doe',          // In a real app, get this from req.body
        userClientId: '1001',            // Unique User ID from your DB
        documentPath: './files/contract.pdf',
        returnUrl: 'http://localhost:3000/contracts?status=signed'
      }
    );
    
    // 4. Return the URL
    res.json({ signingUrl: url });

  } catch (error) {
    console.error('DocuSign Error:', error);
    res.status(500).send('Error generating signing URL');
  }
};