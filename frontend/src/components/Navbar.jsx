import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useConfirmDialog } from "./ConfirmDialog";
import { RiDashboardLine, RiUserLine, RiBriefcaseLine, RiHomeLine, RiAddCircleLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showConfirm, DialogComponent } = useConfirmDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    showConfirm({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Logout",
      variant: "danger",
      onConfirm: () => {
        dispatch(logout());
        navigate("/");
      },
    });
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <RiHomeLine />, exact: true },
    { to: "/jobs", label: "Jobs", icon: <RiBriefcaseLine /> },
    ...(user ? [
      ...(user.role === "employer" ? [{ to: "/add-job", label: "Post Job", icon: <RiAddCircleLine /> }] : []),
      { to: "/dashboard", label: "Dashboard", icon: <RiDashboardLine /> },
      { to: "/profile", label: "Profile", icon: <RiUserLine /> },
    ] : []),
  ];

  const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-blue-600 sm:bg-gradient-to-r sm:from-blue-600 sm:via-blue-500 sm:to-emerald-500 border-b border-white/10"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <span className={`text-xl font-extrabold tracking-tight transition-colors ${
                scrolled ? "text-gray-900" : "text-white"
              }`}>
                Job<span className={scrolled ? "text-blue-500" : "text-emerald-300"}>Scape</span>
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? scrolled
                          ? "bg-blue-50 text-blue-600"
                          : "bg-white/20 text-white"
                        : scrolled
                          ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right: Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      scrolled
                        ? "text-red-500 hover:bg-red-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <RiLogoutBoxLine className="text-base" /> Logout
                  </button>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    scrolled ? "bg-gray-100 text-gray-700" : "bg-white/15 text-white"
                  }`}>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      scrolled ? "text-gray-600 hover:text-blue-600 hover:bg-blue-50" : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      scrolled
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-md hover:-translate-y-0.5"
                        : "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md"
                    }`}
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${
                scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              {isOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsOpen(false)} />

        {/* Mobile Menu Panel */}
        <div className={`fixed top-0 right-0 w-[280px] h-screen bg-white z-[50] md:hidden transition-transform duration-500 ease-out shadow-2xl overflow-hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xl font-extrabold text-gray-900">Job<span className="text-blue-500">Scape</span></span>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-gray-50 text-gray-500"><RiCloseLine className="text-2xl" /></button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {user && (
                <div className="flex items-center gap-3 px-4 py-4 mb-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {getInitials(user.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span> {link.label}
                </NavLink>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 space-y-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  <RiLogoutBoxLine className="text-lg" /> Logout
                </button>
              ) : (
                <>
                  <NavLink to="/login" className="block px-4 py-3.5 rounded-xl text-sm font-bold text-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="block px-4 py-3.5 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-200 transition">
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content going under fixed nav */}
      <div className="h-16 md:h-20" />

      {DialogComponent}
    </>
  );
};

export default Navbar;
