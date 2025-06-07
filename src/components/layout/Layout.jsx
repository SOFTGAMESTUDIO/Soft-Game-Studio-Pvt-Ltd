import React, { Fragment, useContext, use, useState, useEffect } from "react";
import { NavbarMenu } from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";


function Layout({ children }) {

  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const toggleDivs = () => {
    setShowFirstDiv(!showFirstDiv);
  }
  return (
    <div className="bg-purple-100 dark:bg-neutral-950 m-0 p-0">
      <NavbarMenu />
      <div className="">
        <div className="content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
