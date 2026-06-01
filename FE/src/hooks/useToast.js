import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      const id = Date.now();

      setToasts((prev) => [
        ...prev,
        { id, message, type, duration },
      ]);

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  }, []);

  const success = useCallback(
    (message) => showToast(message, "success"),
    [showToast]
  );

  const error = useCallback(
    (message) => showToast(message, "error", 4000),
    [showToast]
  );

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
  };
}
