import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 text-center">
      &copy; {year} All rights reserved.
    </footer>
  );
};

export default Footer;
