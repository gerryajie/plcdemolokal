import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileBarChart2,
  LogOut,
  Activity,
  ChevronDown,
  KeyRound,
  Settings,
} from "lucide-react";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isSettingOpen,
    setIsSettingOpen] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const role =
    user?.role?.toLowerCase() ||
    "operator";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      activeClass:
        "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-200",
    },
    {
      path: "/report",
      label: "Report",
      icon: FileBarChart2,
      activeClass:
        "border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-200",
    },
  ];

  const accountItems = [
    {
      path: "/change-password",
      label: "Change Password",
      icon: KeyRound,
    },
  ];

  const isAccountActive =
    accountItems.some(
      (item) =>
        location.pathname === item.path
    );

  return (
    <>

    <aside
      className="
        hidden
        w-[260px]
        shrink-0
        flex-col
        justify-between
        border-r
        border-white/10
        bg-[linear-gradient(180deg,rgba(8,16,40,0.96),rgba(10,21,43,0.94)_55%,rgba(6,38,48,0.9))]
        p-5
        shadow-2xl
        shadow-black/25
        md:flex
        lg:w-[280px]
        lg:p-6
      "
    >

      <div>

        <div className="flex items-center gap-3 mb-12">

          <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-3 text-slate-950 shadow-[0_0_24px_rgba(34,197,94,0.28)]">
            <Activity size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              PLC SYSTEM
            </h1>

            <p className="text-gray-400 text-sm">
              Industrial Monitoring
            </p>
          </div>

        </div>

        <div className="space-y-3">

          {menuItems.map((item) => {
            const Icon =
              item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition-all hover:border-emerald-400/30 hover:bg-white/5 ${
                  isActive
                    ? item.activeClass
                    : "border-white/5 bg-white/[0.04] text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={20} />
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-2">

            <button
              type="button"
              onClick={() =>
                setIsSettingOpen(
                  (prev) => !prev
                )
              }
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all hover:bg-white/5 ${
                isAccountActive
                  ? "text-emerald-200"
                  : "text-gray-300"
              }`}
            >

              <span className="flex items-center gap-3">
                <Settings size={20} />
                Setting
              </span>

              <ChevronDown
                size={17}
                className={`transition-transform ${
                  isAccountActive
                    ? "text-emerald-300"
                    : "text-gray-500"
                } ${
                  isSettingOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {isSettingOpen && (
            <div className="mt-1 space-y-1">

              {accountItems.map((item) => {
                const Icon =
                  item.icon;

                const isActive =
                  location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all hover:border-emerald-400/30 hover:bg-white/5 ${
                      isActive
                        ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-200"
                        : "border-transparent text-gray-400"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}

            </div>
            )}

          </div>

        </div>

      </div>

      <div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">

          <p className="text-gray-400 text-sm mb-1">
            Logged in as
          </p>

          <h2 className="text-xl font-bold text-green-400">
            {role === "admin" ? "Admin" : "Operator"}
          </h2>

        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/15 py-4 font-semibold text-red-200 transition-all hover:bg-red-500/25"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>

    <nav
      className="
        fixed
        inset-x-3
        bottom-3
        z-50
        grid
        grid-cols-4
        gap-2
        rounded-2xl
        border
        border-white/10
        bg-[#071225]/95
        p-2
        shadow-2xl
        shadow-black/40
        backdrop-blur-xl
        md:hidden
      "
    >
      {menuItems.map((item) => {
        const Icon =
          item.icon;

        const isActive =
          location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition-all ${
              isActive
                ? item.activeClass
                : "border-transparent text-gray-400"
            }`}
          >
            <Icon size={19} />
            {item.label}
          </button>
        );
      })}

      <button
        onClick={() => navigate("/change-password")}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition-all ${
          isAccountActive
            ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-200"
            : "border-transparent text-gray-400"
        }`}
      >
        <KeyRound size={19} />
        Password
      </button>

      <button
        onClick={logout}
        className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-transparent text-xs font-semibold text-red-300 transition-all hover:bg-red-500/10"
      >
        <LogOut size={19} />
        Logout
      </button>
    </nav>

    </>
  );
}
