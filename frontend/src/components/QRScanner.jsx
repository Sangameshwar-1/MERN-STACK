import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { 
      qrbox: { width: 250, height: 250 }, 
      fps: 5 
    });
    
    scanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.ticketId) {
            onScanSuccess(data.ticketId);
            scanner.pause(true);
            setTimeout(() => scanner.resume(), 2000);
          } else {
            setError('Invalid Felicity QR Code');
          }
        } catch {
          if (decodedText.startsWith('FELI-') || decodedText.startsWith('TEAM-')) {
            onScanSuccess(decodedText);
          } else {
            setError('Invalid QR format');
          }
        }
      },
      () => { /* ignore normal scan errors */ }
    );

    return () => {
      scanner.clear().catch(() => console.error('Failed to clear scanner'));
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
