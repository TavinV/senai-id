import React from "react";
import logo from "../../assets/logo.png"; 

const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* Logo */}
            <img
                src={logo}
                alt="Logo SENAI"
                className="w-32 h-auto mb-6 animate-pulse"
            />

            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

            {/* Texto opcional */}
            <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
    );
};

export default LoadingScreen;
