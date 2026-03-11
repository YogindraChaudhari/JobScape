import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { RiBriefcaseLine } from "react-icons/ri";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-white text-xl font-extrabold">Job<span className="text-blue-400">Scape</span></span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Connecting talented professionals with top companies across India and beyond. Your next career move starts here.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {[["Home", "/"], ["Browse Jobs", "/jobs"], ["Dashboard", "/dashboard"], ["Profile", "/profile"]].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Account</h3>
          <ul className="space-y-2.5 text-sm">
            {[["Login", "/login"], ["Register", "/register"], ["Post a Job", "/add-job"]].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} JobScape. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const MainLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: { borderRadius: "12px", padding: "12px 16px", fontSize: "14px", fontFamily: "Inter, sans-serif", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" },
        success: { style: { background: "#10B981", color: "#fff" }, iconTheme: { primary: "#fff", secondary: "#10B981" } },
        error: { style: { background: "#EF4444", color: "#fff" }, iconTheme: { primary: "#fff", secondary: "#EF4444" } },
      }}
    />
  </>
);

export default MainLayout;
