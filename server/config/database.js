const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)



module.exports = {
    uri: 'mongodb://localhost:27017/issue-database', // Databse URI and database name
    db: 'issue-database',
    secret:crypto
  }