import React from "react";
import NavBar from "@/components/NavBar";

const dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <NavBar />
      {children}
    </div>
  );
};

export default dashboard;
