"use client";

import { TbSwitchHorizontal } from "react-icons/tb";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function Home() {
  const [isEnc, setIsEnc] = useState<boolean>(true);
  const [key, setKey] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [output, SetOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const clipboardAnimation = async () => {
    setShowAnimation(true);
    await delay(1000);
    setShowAnimation(false);
  };

  const generateKey = async (key: string): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(key),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  };

  const encrypt = async (text: string, password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const key = await generateKey(password);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    const encryptedContentArray = new Uint8Array(encryptedContent);
    const resultArray = new Uint8Array(
      iv.length + encryptedContentArray.length
    );
    resultArray.set(iv, 0);
    resultArray.set(encryptedContentArray, iv.length);

    return btoa(
      String.fromCharCode.apply(null, resultArray as unknown as number[])
    );
  };

  const decrypt = async (
    encryptedText: string,
    password: string
  ): Promise<string> => {
    const encryptedData = Uint8Array.from(atob(encryptedText), (c) =>
      c.charCodeAt(0)
    );
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);

    const key = await generateKey(password);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  };

  const handleOperation = async (operation: "encrypt" | "decrypt") => {
    if (!key || !text) {
      setError(`Please provide both a key and text to ${operation}.`);
      return;
    }

    try {
      let operationResult;
      if (operation === "encrypt") {
        operationResult = await encrypt(text, key);
      } else {
        operationResult = await decrypt(text, key);
      }
      SetOutput(operationResult);
      setError("");
    } catch (err) {
      setError(
        `${
          operation.charAt(0).toUpperCase() + operation.slice(1)
        }ion failed. Please try again.`
      );
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <h1 className="text-5xl text-center py-8">
          {isEnc ? "encrypt" : "decrypt"}
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center mb-4">
        <label htmlFor="key" className="text-2xl">
          input key:
        </label>
        <input
          autoComplete="off"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          id="key"
          type="text"
          className="w-full max-w-[40%] md:max-w-[90%] text-black focus:outline-none rounded-md px-2 mt-2 break-words"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="text" className="text-2xl">
          {isEnc ? "plaintext:" : "ciphertext:"}
        </label>
        <input
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
          id="text"
          type="text"
          className="w-full max-w-[40%] md:max-w-[90%] text-black focus:outline-none rounded-md px-2 mt-2"
        />
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => handleOperation(isEnc ? "encrypt" : "decrypt")}
          className={`rounded-md py-2 px-4 font-semibold text-xl relative transition-colors duration-500 ${
            isEnc ? "bg-green-400 text-black" : "bg-blue-500"
          }`}
        >
          {isEnc ? "encrypt" : "decrypt"}
        </button>
        <TbSwitchHorizontal
          size={32}
          onClick={() => setIsEnc(!isEnc)}
          className={`${
            isEnc ? "stroke-green-400" : "stroke-blue-500"
          } cursor-pointer absolute ml-[155px]
        hover:scale-110
        transition-all duration-500
        `}
        />
      </div>

      <div className="flex items-center justify-center mt-4 flex-col">
        <div
          id="output"
          className="w-full max-w-[40%] md:max-w-[90%] h-[300px] rounded-md bg-white text-black focus:outline-none px-2 break-words relative"
        >
          {output}

          <IoCloseOutline
            className={`${
              output ? "block" : "hidden"
            } absolute bottom-1 left-1 fill-black stroke-black cursor-pointer
          hover:scale-110 hover:stroke-red-600
          transition-all duration-500
          `}
            onClick={() => {
              SetOutput("");
              setKey("");
              setText("");
            }}
            size={32}
          />

          <LuCopy
            size={24}
            onClick={() => {
              copyToClipboard(output);
              clipboardAnimation();
            }}
            className={`stroke-black absolute bottom-2 right-2 cursor-pointer
          ${showAnimation ? "hidden" : "block"}
          hover:scale-[1.05] hover:stroke-green-400
          transition-all duration-500
            `}
          />
          <FaCheck
            size={24}
            className={`fill-green-400 absolute bottom-2 right-2 cursor-pointer
          hover:scale-[1.05]
          transition-all duration-500 ${showAnimation ? "block" : "hidden"}
          `}
          />
        </div>
        <p className="text-red-600 mt-4 flex">
          {error && (
            <>
              <IoCloseOutline
                size={24}
                onClick={() => setError("")}
                className="stroke-red-600 cursor-pointer
          hover:scale-125
          transition-all duration-500
          "
              />
              {error}
            </>
          )}
        </p>
      </div>

      <div className="flex mt-2 gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 pb-4">
        <Link href={"https://www.linkedin.com/in/ogag/"}>
          <FaLinkedin size={24} />
        </Link>
        <Link href={"https://github.com/adam-gill"}>
          <FaGithub size={24} />
        </Link>
        <Link href={"mailto:adam.douglas.gill@gmail.com"}>
          <IoMdMail size={24} />
        </Link>
      </div>
    </>
  );
}
