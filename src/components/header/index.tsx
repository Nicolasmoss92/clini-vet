"use client";

import { NavLink } from "./NavLink";
import { DropdownService } from "./ButtonDropdownService";
import { ButtonLogin } from "./ButtonLogin";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white h-20 flex items-center justify-between shadow-md px-6">
      
      <div className="flex items-center">
          <div className="relative w-52 h-20">
            <img
              src="/logo.png"
              alt="Logo"
              className="object-contain w-full h-full"
            />
          </div>
      </div>

      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="focus:outline-none text-black"
        >
          {isOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>
      </div>

      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex md:items-center md:space-x-6 absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent px-6 md:px-0 z-10`}
      >
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <NavLink href="/home" label="Início" />
          <DropdownService />
          <NavLink href="/about" label="Sobre nós" />
          <NavLink href="/contact" label="Contato" />
          <ButtonLogin />
        </div>
      </nav>
    </header>
  );
}
