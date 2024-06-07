"use client";
import { auth } from "@/app/firebase/config";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { getCookie } from "cookies-next";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  let userSession: string | null = null;

  if (typeof window !== "undefined") {
    userSession = window.sessionStorage.getItem("user");
  }

  const isSignInPage = usePathname() === "/sign-in";

  useEffect(() => {
    if (router) {
      if (!isSignInPage && !user && !userSession) {
        router.push("/sign-in");
      }
    }
  }, [router, user, userSession, isSignInPage]);

  const handleSignInButton = () => {
    router.push("/sign-in");
  };

  const handleSignOutButton = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("user");
        router.push("/sign-in");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  // get theme cookie and set theme
  const themeCookie = getCookie("theme");

  return (
    <div className="theme-change" data-theme={themeCookie}>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            {/** Mobile Navbar */}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden w-full"
              onClick={() => setDropdownOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {dropdownOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {isClient && (user || userSession) ? (
                  <li>
                    <Link href="/dashboard">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                      >
                        Dashboard
                      </button>
                    </Link>
                  </li>
                ) : null}
                {isClient && (user || userSession) ? (
                  <li>
                    <Link href="/busqueda-contenido">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                      >
                        Crear Entrada
                      </button>
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link href="/">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                      }}
                    >
                      Blog
                    </button>
                  </Link>
                </li>
                <li>
                  <a>Compases Críticos</a>
                  <ul className="p-2">
                    <li>
                      <a>¿Quienes Somos?</a>
                    </li>
                    <li>
                      <a>Sobre el blog</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Contacto</a>
                </li>
              </ul>
            )}
          </div>
          {/** Desktop Navbar */}
          <a
            className="btn btn-ghost text-xl"
            onClick={(e) => {
              e.preventDefault();
              handleReturnHome();
            }}
          >
            Compases Críticos
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {isClient && (user || userSession) ? (
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </a>
              </li>
            ) : null}
            {isClient && (user || userSession) ? (
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/busqueda-contenido");
                  }}
                >
                  Crear Entrada
                </a>
              </li>
            ) : null}
            <li>
              <a>Blog</a>
            </li>
            <li>
              <details>
                <summary>Compases Críticos</summary>
                <ul className="p-2">
                  <li>
                    <a>¿Quienes Somos?</a>
                  </li>
                  <li>
                    <a>Sobre el blog</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Contacto</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {isClient && (
            <button
              className="btn"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                user || userSession
                  ? handleSignOutButton()
                  : handleSignInButton();
              }}
            >
              {/** Conditionally render sign in or sign out button */}
              {user || userSession ? "Cerrar Sesión" : "Iniciar Sesión"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
