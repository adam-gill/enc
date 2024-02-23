import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <React.Fragment>
      <div className="flex items-center justify-center mt-8 mb-8">
        <div className="flex flex-row gap-2 items-center justify-center">
          Copyright &copy; Adam Gill 2024 -
          <Link href={"https://github.com/adam-gill"} target="_blank">
            <FaGithub size={16} />
          </Link>
          <Link href={"https://www.linkedin.com/in/adam-gill-614346264/"} target="_blank">
            <FaLinkedin size={16} />
          </Link>
          <Link href={"https://adamgill.io"} target="_blank">
            <Image height={16} width={16} src={"/ag.png"} alt="ag logo" />
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Footer;
