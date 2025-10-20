import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../context/auth/useAuth";

type UserInfo = {
  company_name?: string;
  name?: string;
  email?: string;
};

const ProfileDropdown: React.FC<{
  user?: UserInfo;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <FaUser />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-gray-800 shadow-lg ring-1 ring-black/5 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-md text-gray-500 truncate">
              {user?.email || user?.company_name || "Account"}
            </div>
          </div>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="block px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            Profile
          </NavLink>
          <NavLink
            to="/managesystem"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="block px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            Management system
          </NavLink>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const userInfo: UserInfo | undefined = user
    ? {
        company_name: (user as Record<string, unknown>)["company_name"] as string | undefined,
        name: (user as Record<string, unknown>)["name"] as string | undefined,
        email: (user as Record<string, unknown>)["email"] as string | undefined,
      }
    : undefined;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[#FF8705] text-white shadow-md">
      <div className="w-full px-6 sm:px-8 lg:px-10 h-14 flex items-center justify-between">
        <div className="text-2xl font-bold tracking-wide">
          {!loading && userInfo?.company_name && (
            <span className="text-white/80">{userInfo.company_name} Stock</span>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiXMark size={22} /> : <HiBars3 size={24} />}
        </button>

        <div className="hidden lg:flex items-center gap-6 text-[15px]">
          <NavLink to="/dashboard" className="hover:text-gray-200">Dashboard</NavLink>
          <NavLink to="/employees" className="hover:text-gray-200">จัดการพนักงาน</NavLink>
          <NavLink to="/employees/probation" className="hover:text-gray-200">พนักงานทดลองงาน</NavLink>
          <NavLink to="/employees/new" className="hover:text-gray-200">เพิ่มพนักงาน</NavLink>
          <NavLink to="/hr/leave" className="hover:text-gray-200">จัดการวันหยุดวันลา</NavLink>

          <ProfileDropdown user={userInfo} onLogout={logout} />
        </div>
      </div>

      {open && (
        <div className="lg:hidden w-full px-6 sm:px-8 pb-3">
          <div className="flex flex-col gap-2 text-[15px]">
            <Link onClick={() => setOpen(false)} to="/dashboard" className="py-2 hover:text-gray-200">
              Dashboard
            </Link>
            <Link onClick={() => setOpen(false)} to="/managestock" className="py-2 hover:text-gray-200">
              Manage Stock
            </Link>
            <Link onClick={() => setOpen(false)} to="/reports/day" className="py-2 hover:text-gray-200">
              Report sell 1day
            </Link>

            <Link onClick={() => setOpen(false)} to="/employees" className="py-2 hover:text-gray-200">
              จัดการพนักงาน
            </Link>
            <Link onClick={() => setOpen(false)} to="/employees/probation" className="py-2 hover:text-gray-200">
              พนักงานทดลองงาน
            </Link>
            <Link onClick={() => setOpen(false)} to="/employees/new" className="py-2 hover:text-gray-200">
              เพิ่มพนักงาน
            </Link>
            <Link onClick={() => setOpen(false)} to="/hr/leave" className="py-2 hover:text-gray-200">
              จัดการวันหยุดวันลา
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="py-2 text-left hover:text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
