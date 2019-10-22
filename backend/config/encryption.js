// This file contains the setup for encrypting private data that is received from the frontend and sent back by the backend
// using the Crypto library

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// Private key that must be kept secret. It must also be the same between the frontend and backend to ensure that encryption and 
// decryption will work properly
const key = "STORYQUESTKEYROCKSTHISWORLDFOREV";
const iv = crypto.randomBytes(16);

module.exports.encrypt = function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
   }
   
module.exports.decrypt = function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
