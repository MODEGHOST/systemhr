import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-14 px-6 pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
