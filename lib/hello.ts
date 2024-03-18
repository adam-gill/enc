import * as crypto from 'crypto';

const saltLength: number = 16; // Define type for salt length

// Function to generate a random salt
function generateRandomSalt(): string {
  return crypto.randomBytes(saltLength).toString('hex');
}

// Function to derive a key from a password using PBKDF2
function deriveKey(key: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(key, salt, 10000, 32, 'sha512');
}

console.log(generateRandomSalt())