import AppRoutes from "./routes";
import { useEffect, useState } from "react";

const defaultBackendStatus = {
  state: "ready",
  message: "Service ready",
};

function ServiceStatusBanner() {
  const [status, setStatus] = useState(
    defaultBackendStatus
  );

  useEffect(() => {
    if (!window.electronAPI) {
      return undefined;
    }

    let cleanup;

    window.electronAPI
      .getBackendStatus()
      .then((backendStatus) => {
        if (backendStatus) {
          setStatus(backendStatus);
        }
      })
      .catch(() => {
        setStatus({
          state: "starting",
          message: "Service belum ready, please wait...",
        });
      });

    if (window.electronAPI.onBackendStatus) {
      cleanup =
        window.electronAPI.onBackendStatus(setStatus);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  if (status.state === "ready") {
    return null;
  }

  const isError = status.state === "error";

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] flex justify-center px-4 pt-4">
      <div
        className={[
          "pointer-events-auto flex max-w-[min(92vw,520px)] items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur",
          isError
            ? "border-red-300/30 bg-red-950/82 text-red-100 shadow-red-950/30"
            : "border-cyan-300/30 bg-slate-950/82 text-cyan-100 shadow-cyan-950/25",
        ].join(" ")}
      >
        <span
          className={[
            "h-2.5 w-2.5 shrink-0 rounded-full",
            isError
              ? "bg-red-300"
              : "animate-pulse bg-cyan-300",
          ].join(" ")}
        />
        <span>{status.message}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ServiceStatusBanner />
      <AppRoutes />
    </>
  );
}
