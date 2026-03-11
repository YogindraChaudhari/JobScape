import { useState } from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", variant = "danger" }) => {
  if (!isOpen) return null;

  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-sm w-full animate-[fadeIn_0.2s_ease-out]">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom hook for easy usage
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "danger",
    confirmText: "Confirm",
  });

  const showConfirm = ({ title, message, onConfirm, variant = "danger", confirmText = "Confirm" }) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
      variant,
      confirmText,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const DialogComponent = (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      title={dialogState.title}
      message={dialogState.message}
      onConfirm={dialogState.onConfirm}
      onCancel={closeDialog}
      variant={dialogState.variant}
      confirmText={dialogState.confirmText}
    />
  );

  return { showConfirm, DialogComponent };
};

export default ConfirmDialog;
