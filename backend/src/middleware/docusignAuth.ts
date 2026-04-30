// src/services/docusignAuth.ts
import docusign from 'docusign-esign';

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

  // 2. Read the RSA Private Key from Environment Variables (Base64 Encoded)
  const base64Key = process.env.PRIVATE_KEY_BASE64;
  if (!base64Key) {
    throw new Error("Missing PRIVATE_KEY_BASE64 environment variable");
  }
  
  // Decode the Base64 string back into the multiline UTF-8 string DocuSign expects
  const rsaKey = Buffer.from(base64Key, 'base64');

  // 3. Request the token
  try {
    const results = await dsApi.requestJWTUserToken(
      process.env.DOCUSIGN_APPLICATION_KEY as string,
      process.env.DOCUSIGN_IMPERSONATED_USER_ID as string,
      ['signature', 'impersonation'],
      rsaKey, // Pass the decoded string directly here
      3600 // Valid for 1 hour
    );

    // 4. Update the cache
    tokenCache = results.body.access_token;
    tokenExpiry = Date.now() + (results.body.expires_in * 1000);

    // Ensure the token actually came back
    if (!tokenCache) {
        throw new Error("DocuSign token not found in response");
    }
    return tokenCache;

  } catch (error) {
    console.error("❌ Failed to generate JWT Token:", error);
    throw new Error("DocuSign JWT Authentication Failed");
  }
};