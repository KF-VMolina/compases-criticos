// src/components/Dashboard.jsx
"use client";
import React, { useState } from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <h1 className="text-2xl text-center p-4">Panel de Autores</h1>
          <p className="text-lg text-center p-4 lg:hidden">
            Bienveido a tu portal, haz clic en el botón para ver las acciones
            disponibles.
          </p>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Ver Acciones
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a className="btn btn-primary w-full" href="/dashboard">
                Inicio
              </a>
              <a className="btn btn-primary w-full mt-2" href="/dashboard">
                Crear Entrada
              </a>
            </li>
            <li>
              <a className="btn btn-primary w-full mt-2" href="/dashboard">
                Mis Publicaciones
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
