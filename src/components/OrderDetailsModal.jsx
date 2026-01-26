import React from "react";

export default function OrderDetailsModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg relative p-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
