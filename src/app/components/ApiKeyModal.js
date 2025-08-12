'use client';

import { useState } from 'react';
import { FiKey, FiX } from 'react-icons/fi';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setError(null);
    setKey('');
    setIsLoading(false);
    onClose();
  }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!key.trim()) {
      setError("API key cannot be empty.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        onSave(key);
        handleClose();
      } else {
        setError(data.error || 'The provided API key is invalid.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-white/10 rounded-lg p-8 shadow-2xl max-w-md w-full relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <FiX/>
        </button>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
            <FiKey className="text-primary text-2xl"/>
        </div>
        <h2 className="text-2xl font-bold text-center text-foreground mb-2">Enter API Key</h2>
        <p className="text-muted-foreground text-center mb-6">
          Your key is validated once and stored in your browser&apos;s local storage.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-muted/50 border border-white/10 placeholder-muted-foreground p-3 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Your Gemini API Key"
          />
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 rounded-md text-foreground bg-muted/50 border border-white/10 hover:bg-accent disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-background bg-foreground hover:bg-foreground/90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Validating...' : 'Save Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}