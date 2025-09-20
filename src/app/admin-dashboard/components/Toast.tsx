// components/admin/components/Toast.tsx
"use client";

import { useEffect } from "react";
import { FiXCircle } from "react-icons/fi";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
      } text-white`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:opacity-75">
          <FiXCircle />
        </button>
      </div>
    </div>
  );
};

export default Toast;
