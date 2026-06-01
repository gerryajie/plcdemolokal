import {
  Bell,
  UserCircle2,
  LogOut,
  FileDown,
} from "lucide-react";
import {
  API_BASE_URL,
} from "../services/api";

const downloadFile = async (url, filename) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Download gagal");
    }

    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    alert(error.message || "Download gagal");
  }
};

export default function Topbar() {
  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  const downloadExcel = () => {
    downloadFile(
      `${API_BASE_URL}/api/reports/excel`,
      "report.xlsx"
    );
  };

  const downloadPDF = () => {
    downloadFile(
      `${API_BASE_URL}/api/reports/pdf`,
      "report.pdf"
    );
  };

  const role = localStorage.getItem("role") || "operator";
  const username =
    localStorage.getItem("username") || "User";
  const isAdmin = role === "admin";

  return (
    <div className="h-[80px] bg-[#0b1220] border-b border-cyan-500/10 flex items-center justify-between px-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard Monitoring
        </h1>

        <p className="text-gray-400">
          Realtime industrial machine analytics
        </p>
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <button
            onClick={downloadExcel}
            className="h-[45px] px-5 rounded-2xl bg-green-500/20 border border-green-500/20 text-green-400 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <FileDown size={18} />
            Excel
          </button>
        )}

        <button
          onClick={downloadPDF}
          className="h-[45px] px-5 rounded-2xl bg-red-500/20 border border-red-500/20 text-red-400 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <FileDown size={18} />
          PDF
        </button>

        <div className="relative">
          <Bell className="text-gray-300" />

          <div className="w-3 h-3 bg-red-500 rounded-full absolute top-0 right-0" />
        </div>

        <div className="flex items-center gap-2">
          <UserCircle2
            className="text-cyan-400"
            size={38}
          />

          <div>
            <h2 className="text-white text-sm">
              {username}
            </h2>

            <p className="text-gray-400 text-xs">
              {isAdmin ? "Administrator" : "Operator"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="h-[45px] px-5 rounded-2xl bg-cyan-500 text-white flex items-center gap-2 hover:scale-105 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
