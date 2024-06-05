import { getCookie } from "cookies-next";
import React from "react";

// get theme cookie and set theme
const themeCookie = getCookie("theme");

const Footer = () => {
  return (
    <div className="theme-change" data-theme={themeCookie}>
      <footer className="footer footer-center p-4">
        <aside>
          <p>
            {" "}
            &copy; {new Date().getFullYear()} Compases Críticos. All rights
            reserved.
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
