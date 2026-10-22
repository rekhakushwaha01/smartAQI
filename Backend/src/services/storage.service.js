const ImageKit = require('@imagekit/nodejs');
const { imagekitPrivateKey } = require('../config/env');

const imagekit = imagekitPrivateKey
  ? new ImageKit({ privateKey: imagekitPrivateKey })
  : null;

async function uploadImage(buffer) {
  if (!imagekit) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not configured in Backend/.env');
  }
  return imagekit.files.upload({
    file: buffer.toString('base64'),
    fileName: 'image.jpg',
  });
}

module.exports = uploadImage;
