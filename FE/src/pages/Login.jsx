import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Factory,
  ShieldCheck,
  Activity,
  BellRing,
  Cpu,
  XCircle,
} from "lucide-react";

const loginHeroImageUrl =
  import.meta.env.VITE_LOGIN_HERO_IMAGE_URL;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errorMessage,
    setErrorMessage] =
    useState("");
const login = async () => {

  try {

    setErrorMessage("");

    const res = await api.post(
      "/auth/login",
      form
    );


    localStorage.setItem(
      "token",
      res.data.token
    );


    localStorage.setItem(
      "username",
      res.data.user.username
    );

    localStorage.setItem(
      "role",
      res.data.user.role
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    navigate("/dashboard");

  } catch (error) {

    setErrorMessage(
      error.response?.data?.message ||
      "Login gagal. Periksa username dan password."
    );

  }

};

  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[linear-gradient(135deg,#050816_0%,#071426_45%,#082f36_100%)]
        p-4
        sm:p-6
      "
    >

      <div
        className="
          z-10
          flex
          min-h-[min(760px,calc(100vh-2rem))]
          w-full
          max-w-7xl
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#0b1220]/90
          shadow-2xl
          shadow-black/35
          backdrop-blur-xl
          lg:grid
          lg:grid-cols-[1.05fr_0.95fr]
        "
      >
        <div
          className="
            relative
            hidden
            flex-col
            justify-between
            overflow-hidden
            bg-[linear-gradient(145deg,rgba(8,145,178,0.24),rgba(6,78,59,0.34)_50%,rgba(8,16,40,0.92))]
            p-8
            lg:flex
            xl:p-12
          "
        >
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{
              backgroundImage:
                `url('${loginHeroImageUrl}')`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <Factory className="text-cyan-300" size={50} />

              <h1 className="text-4xl font-bold text-white xl:text-5xl">
                PLC MONITORING
              </h1>
            </div>

            <p className="max-w-[520px] text-lg text-gray-300 xl:text-xl">
              Realtime industrial monitoring dashboard untuk monitoring mesin,
              PLC, alert, dan analytics.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <Activity className="text-cyan-400 mb-3" />

              <h2 className="text-white font-semibold mb-2">
                Realtime
              </h2>

              <p className="text-gray-400 text-sm">
                Monitoring realtime Socket.io
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <Cpu className="text-cyan-400 mb-3" />

              <h2 className="text-white font-semibold mb-2">
                Multi PLC
              </h2>

              <p className="text-gray-400 text-sm">
                Siemens, OPC UA, Modbus
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <BellRing className="text-cyan-400 mb-3" />

              <h2 className="text-white font-semibold mb-2">
                Smart Alert
              </h2>

              <p className="text-gray-400 text-sm">
                Alert realtime otomatis
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            bg-[linear-gradient(160deg,rgba(5,11,22,0.98),rgba(10,24,49,0.92))]
            p-5
            sm:p-8
            lg:p-12
            xl:p-16
          "
        >
          <div className="w-full max-w-[450px]">

            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-300/20 bg-[linear-gradient(135deg,rgba(239,68,68,0.16),rgba(15,23,42,0.72))] p-4 text-red-100 shadow-xl shadow-red-950/20">

                <div className="flex items-start gap-3">

                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-400/10 text-red-300">
                    <XCircle size={22} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h2 className="font-bold">
                      Login Failed
                    </h2>

                    <p className="mt-1 text-sm text-red-100/80">
                      {errorMessage}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    className="rounded-lg px-2 text-red-100/60 transition hover:bg-white/10 hover:text-red-100"
                  >
                    ×
                  </button>

                </div>

              </div>
            )}

            <div className="mb-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 to-emerald-500/10 sm:h-20 sm:w-20">
                <ShieldCheck className="text-cyan-400" size={40} />
              </div>

              <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl xl:text-5xl">
                Welcome Back
              </h1>

              <p className="text-gray-400">
                Login untuk masuk ke dashboard monitoring
              </p>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Username"
                className="h-[58px] w-full rounded-2xl border border-white/10 bg-[#0d1726] px-5 text-white outline-none transition focus:border-cyan-400"
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="h-[58px] w-full rounded-2xl border border-white/10 bg-[#0d1726] px-5 text-white outline-none transition focus:border-cyan-400"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <button
                onClick={login}
                className="h-[58px] w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:translate-y-[-1px]"
              >
                LOGIN
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:justify-between">
              <span>© 2026 PLC Monitoring</span>

              <span className="text-green-400">
                ● System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
