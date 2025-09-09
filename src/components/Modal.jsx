import React from "react";

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative transform transition-all duration-300 ease-out animate-scaleIn">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Content */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
