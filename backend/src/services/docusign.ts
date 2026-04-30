// 1. USE DEFAULT IMPORT (Fixes SyntaxError)
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
  
  // 2. USE THE PREFIX (docusign.ApiClient) - This is a real class, so 'new' is fine here
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath('https://demo.docusign.net/restapi');
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  
  const envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  // 3. Resolve Path
  const resolvedPath = path.resolve(process.cwd(), args.documentPath);
  console.log(`Reading PDF from: ${resolvedPath}`);
  
  if (!fs.existsSync(resolvedPath)) {
      throw new Error(`PDF file not found at: ${resolvedPath}`);
  }

  const pdfBytes = fs.readFileSync(resolvedPath);
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

  // 4. Create Object Literals typed as interfaces (Removes TS errors)
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

  // 5. Send Envelope
  console.log('Sending envelope to DocuSign...');
  const results = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition: env,
  });
  const envelopeId = results.envelopeId;

  if (!envelopeId) {
    throw new Error('Envelope creation failed, no ID returned.');
  }

  // 6. Create Recipient View (The Signing URL)
  // Use a type intersection (&) to inject the missing properties into the DocuSign type
  const viewRequest: docusign.RecipientViewRequest & { 
    frameAncestors?: string[]; 
    messageOrigins?: string[]; 
  } = {
    returnUrl: args.returnUrl,
    authenticationMethod: 'none',
    email: args.signerEmail,
    userName: args.signerName,
    clientUserId: args.userClientId,
    
    // Now TypeScript will accept these without throwing an error!
    frameAncestors: ['http://localhost:3000', 'https://apps.docusign.com'], 
    messageOrigins: ['https://apps.docusign.com']
  };

  // Ensure this is set to 'focused'
  // This removes the DocuSign header/footer which often causes the block
  const viewResults = await envelopesApi.createRecipientView(accountId, envelopeId, {
    recipientViewRequest: viewRequest,
    displayFormat: 'focused' 
  });

  return viewResults.url!;
};