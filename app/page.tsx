"use client";

import { TbSwitchHorizontal } from "react-icons/tb";
import { useEffect, useState, useRef } from "react";
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
  const keyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        if (window.scrollY === 0) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        } else if (window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        event.preventDefault(); // Prevent the default Ctrl/Cmd+K behavior
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // Reset height to calculate scrollHeight correctly
    e.target.style.height = "32px";
    // Set height to scrollHeight, capped at 128px
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
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

  useEffect(() => {
    keyInputRef.current?.focus();
  }, [])

  return (
    <>
      <div className="w-full flex flex-col max-w-4xl items-center justify-center mx-auto">
        <div className="w-full flex flex-row items-center justify-center">
          <h1 className="text-5xl text-center py-8">
            {isEnc ? "encrypt" : "decrypt"}
          </h1>
        </div>

        <div className="w-full flex flex-col items-center justify-center mb-4">
          <label htmlFor="key" className="text-2xl">
            input key:
          </label>
          <input
            tabIndex={0}
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            id="key"
            type="text"
            ref={keyInputRef}
            className="w-full max-w-[45%] md:max-w-[90%] bg-white text-black focus:outline-none rounded-md px-2 py-1 mt-2 wrap-break-word"
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <label htmlFor="text" className="text-2xl">
            {isEnc ? "plaintext:" : "ciphertext:"}
          </label>
          <textarea
            tabIndex={0}
            autoComplete="off"
            value={text}
            onChange={handleTextChange}
            id="text"
            className="w-full max-w-[45%] md:max-w-[90%] bg-white text-black focus:outline-none rounded-md px-2 py-1 mt-2 resize-none overflow-y-auto no-scrollbar"
            style={{ height: "32px" }}
          />
        </div>

        <div className="w-full flex items-center justify-center mt-4">
          <button
            tabIndex={0}
            onClick={() => handleOperation(isEnc ? "encrypt" : "decrypt")}
            className={`cursor-pointer rounded-md py-2 px-4 font-semibold text-xl relative transition-colors duration-500 ${
              isEnc ? "bg-green-400 text-black" : "bg-blue-500"
            }`}
          >
            {isEnc ? "encrypt" : "decrypt"}
          </button>
          <button
            tabIndex={0}
            className="flex cursor-pointer ml-38.75 absolute"
            onClick={() => setIsEnc(!isEnc)}
          >
            <TbSwitchHorizontal
              size={32}
              className={`${
                isEnc ? "stroke-green-400" : "stroke-blue-500"
              } cursor-pointer
          hover:scale-110
          transition-all duration-500
          `}
            />
          </button>
        </div>

        <div className="w-full flex items-center justify-center mt-4 flex-col">
          <div
            id="output"
            className="w-full max-w-[45%] md:max-w-[90%] min-h-80 h-fit rounded-md bg-white text-black focus:outline-none px-10 py-2 wrap-break-word relative"
          >
            {output}

            <IoCloseOutline
              tabIndex={0}
              className={`${
                output ? "block" : "hidden"
              } absolute top-2 left-2 fill-black stroke-black cursor-pointer
            hover:scale-110 hover:stroke-red-600
            transition-all duration-500
            `}
              onClick={() => {
                SetOutput("");
                setKey("");
                setText("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  SetOutput("");
                  setKey("");
                  setText("");
                }
              }}
              size={32}
            />

            <LuCopy
              tabIndex={0}
              size={24}
              onClick={() => {
                copyToClipboard(output);
                clipboardAnimation();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  copyToClipboard(output);
                  clipboardAnimation();
                }
              }}
              className={`stroke-black absolute top-2 right-2 cursor-pointer
          ${showAnimation || !output ? "hidden" : "block"}
          hover:scale-[1.05]
          transition-all duration-500
          `}
            />
            <FaCheck
              size={24}
              className={`fill-green-400 absolute top-2 right-2 cursor-pointer
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

        <div className="flex w-full items-center justify-center mt-2 gap-2 pb-4">
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
      </div>
    </>
  );
}
