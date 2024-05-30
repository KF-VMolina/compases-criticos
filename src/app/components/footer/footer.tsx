import React from "react";

const Footer = () => {
  return (
    <div>
      <footer
        className="bg-base-200 p-4 text-center"
        style={{ position: "fixed", bottom: 0, width: "100%" }}
      >
        <p>
          &copy; {new Date().getFullYear()} Compases Críticos. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
