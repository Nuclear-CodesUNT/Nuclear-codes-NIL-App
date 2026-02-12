import React, { useEffect, useRef, useState } from 'react';

// 1. TypeScript Augmentation (so TS doesn't yell about window.DocuSign)
declare global {
  interface Window {
    DocuSign: any;
  }
}

interface DocuSignViewerProps {
  signerEmail: string;
  signerName: string;
}

const DocuSignViewer: React.FC<DocuSignViewerProps> = ({ signerEmail, signerName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to the DIV where DocuSign will render
  const signingContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. Load the DocuSign JS Library dynamically
    const scriptUrl = 'https://js-d.docusign.com/bundle.js'; // Use 'js.docusign.com' for PROD
    let script = document.querySelector(`script[src="${scriptUrl}"]`) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      document.body.appendChild(script);
    }

    // 3. Initialize DocuSign once the script is loaded
    script.onload = () => {
      initializeSigningSession();
    };

    // If script is already cached/loaded, run immediately
    if (window.DocuSign) {
      initializeSigningSession();
    }
  }, []);

  const initializeSigningSession = async () => {
    try {
      // A. Fetch the Signing URL from YOUR Backend
      const response = await fetch('http://localhost:4000/api/signing-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail, signerName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse JSON error
        const errorMessage = errorData.message || errorData.error || response.statusText;
        throw new Error(`Server Error: ${errorMessage}`);
        }
      
      const data = await response.json();
      const signingUrl = data.signingUrl;

      // B. Initialize DocuSign
      // REPLACE with your actual Integration Key (Client ID)
      const docusign = await window.DocuSign.loadDocuSign(process.env.DOCUSIGN_INTEGRATION_KEY);

      // C. Render the Signing UI
      const signing = docusign.signing({
        url: signingUrl,
        displayFormat: 'focused', // 'focused' removes the heavy DocuSign header/footer
        style: {
          branding: {
            primaryButton: { backgroundColor: '#333', color: '#fff' } // Custom colors
          }
        }
      });

      // D. Handle Events (Finish, Cancel, etc.)
      signing.on('sessionEnd', (event: any) => {
        if (event.sessionEndType === 'signing_complete') {
          console.log('Document Signed!');
          window.location.reload(); // Refresh to show "Signed" status
        } else {
          console.log('Signing Cancelled');
        }
      });

      // E. Mount to the DOM
      if (signingContainerRef.current) {
        signing.mount(signingContainerRef.current);
        setLoading(false);
      }

    } catch (err) {
      console.error(err);
      setError('Could not load signing session.');
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '800px', width: '100%' }}>
      {loading && <p>Loading Agreement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* DocuSign will inject the iframe strictly into this DIV */}
      <div 
        ref={signingContainerRef} 
        style={{ width: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default DocuSignViewer;