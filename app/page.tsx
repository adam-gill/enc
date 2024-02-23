import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <React.Fragment>
      <NavBar />

      <div className="flex items-center justify-center flex-col">
        <h1 className="text-4xl mb-8">Welcome to Express Encrypt!</h1>
        <p className="text-xl">
          Where you can encrypt and decrypt any text of your choice
        </p>
        <p className="text-xl">
          Our encryption uses sha256 and random salts to ensure that your data
          is secure.
        </p>
        <p className="text-xl mb-8">We will never save any information.</p>

        <Link href={"/dashboard"}>
          <button className="bg-black pt-2 pb-2 pr-4 pl-4 rounded-full text-black text-4xl signin-btn">
            Get started.
          </button>
        </Link>

        <Image
          className="mt-8 rounded-lg"
          alt="encryption photo"
          width={710}
          height={400}
          src={"/encryption-1.jpg"}
        />
      </div>

      <Footer />
    </React.Fragment>
  );
}
