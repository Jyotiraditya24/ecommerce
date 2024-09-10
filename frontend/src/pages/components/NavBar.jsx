import React from "react";
import { Search, ShoppingCart, CircleUser } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="py-2">
      <div className="bg-white max-w-[1260px] mx-auto rounded-2xl px-4 py-2 flex flex-row justify-between items-center gap-x-10">
        <div className="font-medium text-xl">
          <h1>ShopFetti</h1>
        </div>
        <div className="flex flex-row border border-gray-300 rounded-lg w-full items-center pl-2">
          <Search className="w-6 h-6 pr-1" />
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-1 w-full bg-gray-200 marker:rounded-lg placeholder:text-black"
          />
        </div>
        <ShoppingCart className="h-6 w-6" />
        <CircleUser className="h-6 w-6" />
      </div>
    </nav>
  );
};

export default NavBar;
