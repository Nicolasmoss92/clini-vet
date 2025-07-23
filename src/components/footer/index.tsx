"use client";

import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white h-40 flex flex-col items-center justify-center shadow-4xl px-6 w-full">
      <div className="flex flex-row items-center justify-center space-x-12">
       
        <div className="flex flex-col items-center">
          
          <img src="/logo.png" alt="Logo" className="h-20 mb-4" />

        
          <div className="flex space-x-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6 text-blue-600" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-6 h-6 text-blue-400" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-sm">CNPJ: 00.000.000/0000-00</p>
          <p className="text-sm">Email: contato@empresa.com</p>
          <p className="text-sm">Telefone: (11) 99999-9999</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
