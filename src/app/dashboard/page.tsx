// src/components/Dashboard.jsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  return (
    <div>
      <main className="container mx-auto p-4">
        {/* Hero Section */}
        <section className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white">
          <h2 className="text-4xl font-bold mb-4">
            Bienvenido al panel de control de Compases Críticos
          </h2>
          <p className="text-xl mb-6">
            Consulta tus estadísticas y edita tu perfil de usuario aquí.
          </p>
          <button
            className="btn btn-accent"
            onClick={(e) => {
              e.preventDefault();
              router.push("/editar-perfil");
            }}
          >
            Editar Perfil
          </button>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Estadísticas</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Estadística 1</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Estadística 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Estadística 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
