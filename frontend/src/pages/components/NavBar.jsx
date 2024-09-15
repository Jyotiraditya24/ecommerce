import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  CircleUser,
  LayoutDashboard,
} from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";

const NavBar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role;
  const [isMiniPopUp, setIsMiniPopUp] = useState(false);
  const { cart, getCartItems } = useCartStore();

  const handleLogout = () => {
    logout();
  };

  const handleMiniPopUp = () => {
    setIsMiniPopUp(!isMiniPopUp);
  };

  useEffect(() => {
    getCartItems();
  }, []); 

  return (
    <div>
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
            {user && (
              <Link to="/cart" className="relative">
                {/* Cart Icon with Improved Styling */}
                <ShoppingCart className="h-6 w-6 cursor-pointer" />
                {cart.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </div>
                )}
              </Link>
            )}
            <div className="relative">
              <CircleUser
                className="h-6 w-6 cursor-pointer transition-transform transform hover:scale-110"
                onClick={handleMiniPopUp}
              />
              {isMiniPopUp && (
                <div className="absolute top-8 -left-28 w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-50 transition-opacity duration-200 ease-in-out opacity-100">
                  <div className="flex flex-col gap-y-4">
                    <button
                      onClick={() => setIsMiniPopUp(false)}
                      className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                    >
                      Your Profile
                    </button>
                    {user ? (
                      <button
                        onClick={() => {
                          setIsMiniPopUp(false);
                          handleLogout();
                        }}
                        className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMiniPopUp(false)}
                        className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isAdmin === "admin" && (
              <div className="flex flex-row items-center gap-x-3 border px-4 py-1 rounded-xl">
                <h1>DashBoard</h1>
                <LayoutDashboard className="h-6 w-6" />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
