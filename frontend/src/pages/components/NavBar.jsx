import React from "react";
import {
  Search,
  ShoppingCart,
  CircleUser,
  LayoutDashboard,
} from "lucide-react";

const NavBar = () => {
  const user = true;
  const isAdmin = true;
  const isProfile = false;
  return (
    <nav className="py-2">
      <div className="bg-white max-w-[1260px] mx-auto rounded-2xl px-4 py-2 flex flex-row justify-between items-center gap-x-10">
        <div className="font-medium text-xl basis-1/4">
          <h1>ShopFetti</h1>
        </div>
        <div className="flex flex-row border border-gray-300 rounded-lg w-full items-center pl-2 basis-1/2">
          <Search className="w-6 h-6 pr-1" />
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-1 w-full bg-gray-200 marker:rounded-lg placeholder:text-black"
          />
        </div>
        <div className="flex flex-row justify-end gap-x-10 items-center basis-1/4">
          {user && <ShoppingCart className="h-6 w-6" />}
          <div className="relative">
            <CircleUser className="h-6 w-6" />
            {isProfile && (
              <div className="absolute -left-24 w-[200px] h-[200px] bg-white flex flex-col p-3">
                <h1>Your profile</h1>
                <h2>Logout</h2>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex flex-row items-center gap-x-3 border px-2 py-1 rounded-xl">
              <h1>DashBoard</h1>
              <LayoutDashboard className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
