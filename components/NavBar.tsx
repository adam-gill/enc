import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <React.Fragment>
      <div className="flex items-center justify-center w-full">
        <ul className="flex flex-row gap-2 text-2xl pl-8 pr-8 pt-4 pb-4 justify-between items-center w-full max-w-[1200px]">
          <Link href={"/"}>
            <li className="flex flex-row gap-2 items-center justify-center cursor-pointer">
              <Image src={"/logo.png"} alt="logo" width={64} height={64} />
              <p className="text-2xl">Express Encryption</p>
            </li>
          </Link>
          <li className="flex items-center justify-center">
            <div className="flex flex-row gap-6 items-center justify-center">
              <Link href={"/dashboard"}>
                <div className="regular-btn">Encrypt/Decrypt</div>
              </Link>
              <div className="regular-btn cursor-not-allowed">About</div>
              <div className="bg-black pt-2 pb-2 pr-4 pl-4 rounded-full text-black signin-btn cursor-not-allowed">
                Sign in
              </div>
            </div>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
