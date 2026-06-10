import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Inject html5-qrcode script if not present (or use npm package)
    const initScanner = () => {
      const scanner = new Html5QrcodeScanner('reader', { 
        qrbox: { width: 250, height: 250 }, 
        fps: 5 
      });
      
      scanner.render(
        (decodedText) => {
          try {
            // Expected QR data format from backend: { ticketId: 'FELI-123', ... }
            const data = JSON.parse(decodedText);
            if (data.ticketId) {
              onScanSuccess(data.ticketId);
              // Pause briefly after scan to prevent rapid-fire
              scanner.pause(true);
              setTimeout(() => scanner.resume(), 2000);
            } else {
              setError('Invalid Felicity QR Code');
            }
          } catch (e) {
            // Handle raw ticket ID strings just in case
            if (decodedText.startsWith('FELI-') || decodedText.startsWith('TEAM-')) {
              onScanSuccess(decodedText);
            } else {
              setError('Invalid QR format');
            }
          }
        },
        (err) => { /* ignore normal scan errors */ }
      );
      
      return scanner;
    };

    let html5QrcodeScanner;
    // We dynamically load the script to avoid package issues with some bundlers
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode';
    script.async = true;
    script.onload = () => { html5QrcodeScanner = initScanner(); };
    document.body.appendChild(script);

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
      document.body.removeChild(script);
    };
  }, [onScanSuccess]);

  return (
    <div className="qr-scanner-wrapper">
      <h3>Scan Participant Ticket</h3>
      <p className="text-sm">Align the QR code within the frame.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
    </div>
  );
};

export default QRScanner;
