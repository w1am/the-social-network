import React from 'react'
import { FaSpinner } from 'react-icons/fa'

interface SubmitProps {
  label: string;
  loading: boolean;
  onClick?: any
}

export const Submit: React.FC<SubmitProps> = ({ label, loading, ...props }) => {
  return (
    <div className="mt-5">
      <button
        type="submit"
        className="w-full px-4 py-3 disabled:cursor-default disabled:bg-blue-500 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors ease-in-out duration-300"
        disabled={loading}
        {...props}
      >
        <div className="flex justify-center">
          {loading && (
            <FaSpinner size={16} className="animate-spin my-auto mr-2" />
          )}
          {label}
        </div>
      </button>
    </div>
  );
}

export default Submit