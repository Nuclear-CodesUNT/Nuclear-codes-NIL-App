// src/services/docusignAuth.ts
import docusign from 'docusign-esign';
import fs from 'fs';
import path from 'path';

let tokenCache: string | null = null;
let tokenExpiry: number = 0;

export const getValidToken = async (): Promise<string> => {
  // 1. Check if we already have a valid token (with a 5-minute safety buffer)
  if (tokenCache && Date.now() < tokenExpiry - 300000) {
    return tokenCache;
  }

  console.log("🔄 Requesting new DocuSign JWT Token...");

  const dsApi = new docusign.ApiClient();
  // Use 'account-d.docusign.com' for demo/developer accounts
  dsApi.setOAuthBasePath('account-d.docusign.com'); 

  // 2. Read your RSA Private Key from the root directory
  const rsaKeyPath = path.resolve(process.cwd(), 'private.key');
  const rsaKey = fs.readFileSync(rsaKeyPath);

  // 3. Request the token
  try {
    const results = await dsApi.requestJWTUserToken(
      process.env.DOCUSIGN_APPLICATION_KEY as string,
      process.env.DOCUSIGN_IMPERSONATED_USER_ID as string,
      ['signature', 'impersonation'],
      rsaKey,
      3600 // Valid for 1 hour
    );

    // 4. Update the cache
    tokenCache = results.body.access_token;
    tokenExpiry = Date.now() + (results.body.expires_in * 1000);

    return tokenCache;
  }
   catch (error) {
    console.error("❌ Failed to generate JWT Token:", error);
    throw new Error("DocuSign JWT Authentication Failed");
  }
};