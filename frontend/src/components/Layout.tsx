import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import logo from "../assets/logo.png";
import logo_green from "../assets/logo-green.png";
import englishIcon from "../assets/english.svg";

export default function Layout({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (!auth) return null;

  const { user, login, logout } = auth;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true } as any);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-slate-900">
      <header
        className={`${
          scrolled
            ? "bg-[rgb(40_78_76_/_0.988)] text-white border-transparent"
            : "bg-white text-slate-900 border-slate-200"
        } sticky top-0 z-40 w-full border-b transition-colors duration-300 h-[88px]`}
      >
        <div className="max-w-[1400px] mx-auto px-4 h-[88px] flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              to={user ? "/dashboard/management/reviews" : "/reviews"}
              className="inline-flex items-center gap-2 hover:opacity-90"
            >
              <img
                src={scrolled ? logo : logo_green}
                alt="Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <nav
              className={`hidden md:flex items-center gap-8 text-[13px] ${
                scrolled ? "text-white/80" : "text-slate-600"
              }`}
            >
              {user ? (
                <>
                  <Link
                    to="/dashboard/management/reviews"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    Reviews
                  </Link>
                  <Link
                    to="/dashboard/management/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                    Properties
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                    Landlords
                  </Link>
                  <Link
                    to="/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75 .75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                    About Us
                  </Link>
                  <Link
                    to="/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    Careers
                  </Link>
                  <Link
                    to="/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    Contact
                  </Link>
                  <Link
                    to="/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <img src={englishIcon} alt="English" className="w-4 h-4" />
                    English
                  </Link>
                  <Link
                    to="/properties"
                    className={`inline-flex items-center gap-2 ${
                      scrolled ? "hover:text-white" : "hover:text-slate-900"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        d="M5 20H19M5 13H15M18 6.81794C17.1896 5.14985 15.4791 4 13.5 4C10.7386 4 8.5 6.23858 8.5 9V17C8.5 18.6569 7.15685 20 5.5 20"
                        strokeLinecap="round"
                      />
                    </svg>
                    GBP
                  </Link>
                </>
              )}
            </nav>
            {!user ? (
              <button
                onClick={login}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${
                    scrolled
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {initials(user.name)}
                </div>
                <button
                  onClick={logout}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    scrolled
                      ? "border border-white/40 hover:bg-white/10"
                      : "border border-slate-300 hover:bg-slate-50"
                  }`}
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 pb-10 pt-6">{children}</main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        © The Flex. All rights reserved.
      </footer>
    </div>
  );
}
