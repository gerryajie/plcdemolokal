import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export default function Toast({
  id,
  type = "success",
  message,
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400/30"
      : "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/30";

  const textColor =
    type === "success"
      ? "text-emerald-100"
      : "text-red-100";

  const icon =
    type === "success" ? (
      <CheckCircle
        size={20}
        className="text-emerald-400"
      />
    ) : (
      <AlertCircle
        size={20}
        className="text-red-400"
      />
    );

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${bgColor} ${textColor} animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      {icon}
      <span className="flex-1 text-sm font-medium">
        {message}
      </span>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
