import React from "react";
import ecommerceicon from "../icons/ecommerceLogo.png";
import { Link } from "react-router-dom";
import { PiFinnTheHuman } from "react-icons/pi";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import backgroundImage from "../icons/background.jpg";

const Signup = () => {
  return (
    <div className="min-h-screen bg-[rgb(97,170,156)] flex flex-row justify-center items-center">
      <div className="min-w-[720px] bg-white grid grid-cols-6 rounded-lg p-2">
        <div className="col-span-3">
          <div className="flex flex-col p-8 gap-y-10">
            <div className="flex flex-row items-center justify-start gap-x-2">
              <img
                src={ecommerceicon}
                alt="ecommerce logo"
                className="w-14 h-14"
              />
              <h1 className="font-medium text-xl">ShopFetti</h1>
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-5xl font-extrabold">Get started</h1>
              <div className="flex flex-row items-center justify-start gap-x-2">
                <span className="font-light text-gray-400">
                  Already have an account?
                </span>
                <span>
                  <Link to="/signin">Sign in</Link>
                </span>
              </div>
            </div>

            <form className="flex flex-col gap-y-10">
              <div className="border border-gray-300 rounded-lg relative">
                <label htmlFor="name" className="absolute bottom-10 left-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="pl-2 pr-4 py-2 w-full"
                  id="name"
                />
                <PiFinnTheHuman className="absolute right-4 bottom-2.5 h-5 w-5" />
              </div>
              <div className="border border-gray-300 rounded-lg relative">
                <label htmlFor="email" className="absolute bottom-10 left-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-2 pr-4 py-2 w-full"
                  id="email"
                />
                <MdOutlineEmail className="absolute right-4 bottom-2.5 h-5 w-5" />
              </div>
              <div className="border border-gray-300 rounded-lg relative">
                <label htmlFor="password" className="absolute bottom-10 left-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="pl-2 pr-4 py-2 w-full"
                  id="password"
                />
                <RiLockPasswordLine className="absolute right-4 bottom-2.5 h-5 w-5" />
              </div>
              <div className="border border-gray-300 rounded-lg relative">
                <label htmlFor="email" className="absolute bottom-10 left-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-2 pr-4 py-2 w-full"
                  id="email"
                />
                <MdOutlineEmail className="absolute right-4 bottom-2.5 h-5 w-5" />
              </div>
              <div>
                <button className="w-full bg-[rgb(12,73,62)] text-white rounded-xl px-4 py-2">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-span-3">
          <div className="w-full h-full">
            <img
              src={backgroundImage}
              alt="background image"
              className="w-[500px] h-[100%] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
