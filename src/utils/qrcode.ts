import qrcode from 'qrcode';

import logger from '@/config/logger';

const generateQRCode = async (text: string, options: qrcode.QRCodeToDataURLOptions = {}): Promise<string> => {
  try {
    const qrConfig: qrcode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      ...options,
    };

    const qrCode = await qrcode.toDataURL(text, qrConfig);
    return qrCode;
  } catch (error) {
    logger.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export default generateQRCode;
