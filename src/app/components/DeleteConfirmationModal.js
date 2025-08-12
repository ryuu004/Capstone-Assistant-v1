'use client';

import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function DeleteConfirmationModal({ isOpen, onCancel, onConfirm, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-white/10 rounded-lg p-8 shadow-2xl max-w-md w-full relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <FiX />
        </button>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
          <FiAlertTriangle className="text-red-500 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-center text-foreground mb-2">Delete Chat</h2>
        <p className="text-muted-foreground text-center mb-6">
          Are you sure you want to delete this conversation? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-md text-foreground bg-muted/50 border border-white/10 hover:bg-accent disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}