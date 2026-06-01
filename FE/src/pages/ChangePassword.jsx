import { useState } from "react";
import {
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import ToastContainer from "../components/ToastContainer";
import {
  changePassword,
} from "../services/userService";
import { useToast } from "../hooks/useToast";

export default function ChangePassword() {

  const { toasts, removeToast, success, error } = useToast();

  const [form, setForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [status, setStatus] =
    useState({
      type: "",
      message: "",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const updateField =
    (field, value) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setStatus({
        type: "",
        message: "",
      });

      if (
        form.newPassword !==
        form.confirmPassword
      ) {

        const errorMsg = "Konfirmasi password baru tidak sama";
        error(errorMsg);
        setStatus({
          type: "error",
          message: errorMsg,
        });

        return;

      }

      try {

        setIsSubmitting(true);

        const data =
          await changePassword({
            currentPassword:
              form.currentPassword,
            newPassword:
              form.newPassword,
          });

        const successMsg =
          data.message ||
          "Password berhasil diubah";

        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setStatus({
          type: "success",
          message: successMsg,
        });

        success(successMsg);

      } catch (err) {

        const errorMsg =
          err.response?.data?.message ||
          "Password gagal diubah";

        error(errorMsg);
        setStatus({
          type: "error",
          message: errorMsg,
        });

      } finally {

        setIsSubmitting(false);

      }
    };

  return (

    <MainLayout>

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mx-auto max-w-3xl">

        <div className="mb-6 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,16,40,0.96),rgba(12,27,55,0.9)_58%,rgba(6,78,59,0.18))] p-5 shadow-2xl shadow-black/20 sm:p-7">

          <div className="mb-6 flex items-start gap-4">

            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
              <ShieldCheck size={26} />
            </div>

            <div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Account Security
              </p>

              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Change Password
              </h1>

              <p className="mt-2 text-sm text-gray-400 sm:text-base">
                Password hanya akan diperbarui untuk akun yang sedang login.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <PasswordField
              label="Current Password"
              value={form.currentPassword}
              onChange={(value) =>
                updateField(
                  "currentPassword",
                  value
                )
              }
              icon={<LockKeyhole size={18} />}
            />

            <PasswordField
              label="New Password"
              value={form.newPassword}
              onChange={(value) =>
                updateField(
                  "newPassword",
                  value
                )
              }
              icon={<KeyRound size={18} />}
            />

            <PasswordField
              label="Confirm New Password"
              value={form.confirmPassword}
              onChange={(value) =>
                updateField(
                  "confirmPassword",
                  value
                )
              }
              icon={<KeyRound size={18} />}
            />

            {status.message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  status.type === "success"
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                    : "border-red-300/20 bg-red-400/10 text-red-200"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-emerald-300/20 bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/15 transition-all hover:translate-y-[-1px] disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : "Save New Password"}
            </button>

          </form>

        </div>

      </div>

    </MainLayout>

  );

}

function PasswordField({
  label,
  value,
  onChange,
  icon,
}) {

  return (

    <label className="block">

      <span className="mb-2 block text-sm font-semibold text-gray-300">
        {label}
      </span>

      <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1836] px-4 py-3 text-gray-400 transition focus-within:border-emerald-400/60">

        {icon}

        <input
          type="password"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-w-0 flex-1 bg-transparent text-white outline-none"
          required
        />

      </span>

    </label>

  );

}
