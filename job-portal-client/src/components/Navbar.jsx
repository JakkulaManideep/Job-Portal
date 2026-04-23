import React, { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { USER_ROLES, getUserRole } from "../utils/roles";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const role = getUserRole(user);

  const navItems = useMemo(() => {
    const baseItems = [
      { path: "/", title: "Start a Search" },
      { path: "/salary", title: "Salary Estimate" },
    ];

    if (role === USER_ROLES.JOB_PROVIDER) {
      baseItems.push({ path: "/my-job", title: "My Jobs" });
      baseItems.push({ path: "/post-job", title: "Post a Job" });
    }

    return baseItems;
  }, [role]);

  return (
    <header className="max-w-screen container mx-auto xl:px-24 px-4">
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl text-black">
          <svg width="29" height="30" viewBox="0 0 29 30" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
            <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
          </svg>
          <span>JobJunction</span>
        </a>

        <ul className="hidden md:flex gap-12">
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-primary">
              <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                {title}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="text-base text-primary font-medium space-x-5 hidden lg:flex items-center">
          <SignedOut>
            <Link to="/login" className="py-2 px-5 border rounded">
              Login
            </Link>
            <Link to="/sign-up" className="py-2 px-5 border rounded bg-blue text-white">
              Sign up
            </Link>
          </SignedOut>

          <SignedIn>
            {!role ? (
              <Link to="/select-role" className="py-2 px-5 border rounded bg-blue text-white">
                Choose Role
              </Link>
            ) : null}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="md:hidden block">
          <button onClick={() => setIsMenuOpen((prev) => !prev)}>
            {isMenuOpen ? (
              <FaXmark className="w-5 h-5 text-primary" />
            ) : (
              <FaBarsStaggered className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </nav>

      <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-white py-1">
              <NavLink to={path} className={({ isActive }) => (isActive ? "active" : "")}>
                {title}
              </NavLink>
            </li>
          ))}

          <SignedOut>
            <li className="text-white py-1">
              <Link to="/login">Login</Link>
            </li>
            <li className="text-white py-1">
              <Link to="/sign-up">Sign up</Link>
            </li>
          </SignedOut>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;