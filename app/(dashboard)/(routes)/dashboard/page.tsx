import React from "react";
import { Input } from "@/components/ui/input";

interface dashboardProps {}

const dashboard: React.FC<dashboardProps> = () => {
  return (
    <React.Fragment>
      <div className="w-full max-w-[1200px] flex flex-col items-center justify-center mx-auto">
        <div className="flex">
          <input
            type="text"
            placeholder="Input"
            className="text-white bg-black border-2 border-[#ffffff48] p-2 rounded focus:outline-[#ffffff9a] mr-4"
          ></input>
          <input
            type="text"
            placeholder="Output"
            className="text-white bg-black border-2 border-[#ffffff48] p-2 rounded focus:outline-[#ffffff9a]"
          ></input>
        </div>
        <div className="flex flex-row bg-white text-black rounded pl-4 pr-4 pt-1 pb-1 mt-8">
          <button>Encrypt</button>
        </div>

      </div>
    </React.Fragment>
  );
};

export default dashboard;


// import * as crypto from 'crypto';

// // Function to generate a random salt
// function generateRandomSalt(saltLength: number = 16): string {
//   return crypto.randomBytes(saltLength).toString('hex');
// }

// // Function to encrypt text using a key and salt
// function encryptText(text: string, key: string, salt?: string): { ciphertext: string; salt: string } {
//   const algorithm = 'aes-256-cbc'; // Replace with desired algorithm (e.g., aes-128-gcm)
//   const ivLength = 16; // Adjust based on algorithm requirements

//   // Generate random salt if not provided
//   const randomSalt = salt || generateRandomSalt(saltLength);

//   // Derive key using PBKDF2 for added security
//   const derivedKey = crypto.pbkdf2Sync(key, randomSalt, 10000, 32, 'sha512');

//   // Create initialization vector (IV)
//   const iv = crypto.randomBytes(ivLength);

//   // Create cipher
//   const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);

//   // Encrypt text and append IV
//   const encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

//   // Base64 encode for safe storage/transmission (optional)
//   const base64Encoded = Buffer.from(encryptedText, 'hex').toString('base64');

//   return { ciphertext: base64Encoded || encryptedText, salt: randomSalt };
// }

// // Example usage
// const text = 'This is a secret message.';
// const key = 'my-strong-key';
// const encrypted = encryptText(text, key);

// console.log('Encrypted Text:', encrypted.ciphertext);
// console.log('Salt:', encrypted.salt);

