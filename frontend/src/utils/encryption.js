// This file contains the setup and code for encrypting and decrypting different strings or even buffers using the Crypto library

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// Set the unique key known only to frontend and backend here.
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
