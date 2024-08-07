"use client";

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

function AddPostButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      className="bg-red-500 p-2 mt-2 rounded-md text-white disabled:bg-red-300 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <FaSpinner className="animate-spin text-black" />
          
        </div>
      ) : (
        "Send"
      )}
    </button>
  );
}

export default AddPostButton;
