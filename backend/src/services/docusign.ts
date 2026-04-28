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
  
  // 2. USE THE PREFIX (docusign.ApiClient)
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

  // 4. Create Envelope Definition
  const env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please sign this document';

  // Create Document
  const doc = new docusign.Document();
  doc.documentBase64 = pdfBase64;
  doc.name = 'Contract'; 
  doc.fileExtension = 'pdf';
  doc.documentId = '1';

  // Create Signer
  const signer = new docusign.Signer();
  signer.email = args.signerEmail;
  signer.name = args.signerName;
  signer.recipientId = '1';
  signer.clientUserId = args.userClientId;

  // Create SignHere Tab
  const signHere = new docusign.SignHere();
  signHere.documentId = '1';
  signHere.pageNumber = '1';
  signHere.recipientId = '1';
  signHere.tabLabel = 'SignHereTab';
  signHere.xPosition = '100';
  signHere.yPosition = '150';

  // Add tab to signer
  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  // Add recipients
  const recipients = new docusign.Recipients();
  recipients.signers = [signer];
  env.recipients = recipients;

  // Add document
  env.documents = [doc];
  env.status = 'sent';

  // 5. Send Envelope
  console.log('Sending envelope to DocuSign...');
  const results = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition: env,
  });
  const envelopeId = results.envelopeId;

  if (!envelopeId) {
    throw new Error('Envelope creation failed, no ID returned.');
  }

    // 5. Create Recipient View (The Signing URL)
    const viewRequest = new docusign.RecipientViewRequest();
    viewRequest.returnUrl = args.returnUrl;
    viewRequest.authenticationMethod = 'none';
    viewRequest.email = args.signerEmail;
    viewRequest.userName = args.signerName;
    viewRequest.clientUserId = args.userClientId;

    // ADD THESE TWO LINES TO FIX THE EMBEDDING ERROR
    viewRequest.frameAncestors = ['http://localhost:3000', 'https://apps.docusign.com']; 
    viewRequest.messageOrigins = ['https://apps.docusign.com'];

    // 2. ENSURE THIS IS SET TO 'focused'
    // This removes the DocuSign header/footer which often causes the block
    const viewResults = await envelopesApi.createRecipientView(accountId, envelopeId, {
    recipientViewRequest: viewRequest,
    displayFormat: 'focused' 
    });


  return viewResults.url!;
};