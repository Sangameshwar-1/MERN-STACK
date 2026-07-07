const QRCode = require('qrcode');

/**
 * Generate a QR code as base64 data URL
 * @param {string} data - The data to encode in the QR
 * @returns {Promise<string>} base64 QR code image
 */
const generateQRCode = async (data) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      },
      width: 300
    });
    return qrDataUrl;
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
};

module.exports = { generateQRCode };
