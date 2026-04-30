import docusign from 'docusign-esign';
import * as fs from 'fs';
import * as path from 'path';

interface SigningRequest {
  signerEmail: string;
  signerName: string;
  userClientId: string; 
  documentPath: string; 
  returnUrl: string;   
}

export const generateSigningUrl = async (
  accessToken: string,
  accountId: string,
  args: SigningRequest
): Promise<string> => {
  
  // 1. Dynamic Base Path (Demo for testing, Production for live)
  const DOCUSIGN_BASE_PATH = process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi';
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(DOCUSIGN_BASE_PATH);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  
  const envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  // 2. Resolve Path (Reminder: Ensure 'files' is deployed to your cloud server!)
  const resolvedPath = path.resolve(process.cwd(), args.documentPath);
  console.log(`Reading PDF from: ${resolvedPath}`);
  
  if (!fs.existsSync(resolvedPath)) {
      throw new Error(`PDF file not found at: ${resolvedPath}`);
  }

  const pdfBytes = fs.readFileSync(resolvedPath);
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

  const doc: docusign.Document = {
    documentBase64: pdfBase64,
    name: 'Contract', 
    fileExtension: 'pdf',
    documentId: '1'
  };

  const signHere: docusign.SignHere = {
    documentId: '1',
    pageNumber: '1',
    recipientId: '1',
    tabLabel: 'SignHereTab',
    xPosition: '100',
    yPosition: '150'
  };

  const tabs: docusign.Tabs = {
    signHereTabs: [signHere]
  };

  const signer: docusign.Signer = {
    email: args.signerEmail,
    name: args.signerName,
    recipientId: '1',
    clientUserId: args.userClientId,
    tabs: tabs
  };

  const recipients: docusign.Recipients = {
    signers: [signer]
  };

  const env: docusign.EnvelopeDefinition = {
    emailSubject: 'Please sign this document',
    documents: [doc],
    recipients: recipients,
    status: 'sent'
  };

  console.log('Sending envelope to DocuSign...');
  const results = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition: env,
  });
  const envelopeId = results.envelopeId;

  if (!envelopeId) {
    throw new Error('Envelope creation failed, no ID returned.');
  }

  // 3. Dynamic Frontend URL for frameAncestors
  const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:3000';

  const viewRequest: docusign.RecipientViewRequest & { 
    frameAncestors?: string[]; 
    messageOrigins?: string[]; 
  } = {
    returnUrl: args.returnUrl,
    authenticationMethod: 'none',
    email: args.signerEmail,
    userName: args.signerName,
    clientUserId: args.userClientId,
    
    // Dynamically inject the allowed URL based on environment
    frameAncestors: [FRONTEND_URL, 'https://apps.docusign.com'], 
    messageOrigins: ['https://apps.docusign.com']
  };

  const viewResults = await envelopesApi.createRecipientView(accountId, envelopeId, {
    recipientViewRequest: viewRequest,
    displayFormat: 'focused' 
  });

  return viewResults.url!;
};