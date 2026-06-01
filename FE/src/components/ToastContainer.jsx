import Toast from "./Toast";

export default function ToastContainer({
  toasts,
  onClose,
}) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
