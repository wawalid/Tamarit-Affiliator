import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <main className="container mx-auto px-4 py-2 bg-zinc-900 min-h-screen">
      <Navbar />
      <Outlet />
    </main>
  );
}

export default MainLayout;
