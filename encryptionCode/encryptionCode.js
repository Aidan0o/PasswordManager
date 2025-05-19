const crypto = require('crypto')


const algorithm = 'aes-192-cbc' //algorithm used to encrypt the string
const passkey = 'users login password hash' //will be the users Hash - means user can only decrypt their own passowrds (not same key for everyone)
const key = crypto.scryptSync(passkey, 'salt', 24) //make longer when using hash (64 or more)
const iv = crypto.randomBytes(16)





function encrypt(originalText) {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(originalText, 'utf8', 'base64'); //takes the utf-8 text, encrypts it, then converts it to base64 (base64 as its shorter than having it as hex)
    encrypted += cipher.final('base64')
    console.log("enryptedTextHex: ", encrypted)
    return encrypted;
}


function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8')
    return decrypted;
}

//function to check the encryption works
function testEncryption() {
    const originalText = "something secret"
    const encryptedText = encrypt(originalText);
    console.log("enryptedText: ", encryptedText)
    // now encryptedText is the encrypted version of originalText. 
    // to test: 
    const decryptedText = decrypt(encryptedText);
    if (decryptedText == originalText) {
        console.log("SUCCESS");
    } else {
        console.error("FAILED")
    }


}


testEncryption();

//Link to sources: https://nodejs.org/api/crypto.html#cipherupdatedata-inputencoding-outputencoding