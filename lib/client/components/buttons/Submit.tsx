import React from 'react'
import { FaSpinner } from 'react-icons/fa'

interface SubmitProps {
  label: string;
  loading: boolean;
  onClick?: any;
  separator?: boolean;
  size?: "xs" | "s" | "md" | "lg";
  colorScheme?: "pending" | "facebook" | "unfriend";
  disabled?: boolean;
}

export const Submit: React.FC<SubmitProps> = ({
  label,
  loading,
  size = "s",
  separator = false,
  disabled=false,
  colorScheme = "facebook",
  ...props
}) => {
  return (
    <div className={`${separator ? "mt-6" : ""}`}>
      <button
        type="submit"
        className={`
          w-full
          px-4 py-3
          text-${size}
          disabled:cursor-default
          cursor-pointer
          rounded-md 
          ${
            colorScheme == "facebook"
              ? "disabled:bg-blue-500"
              : "disabled:bg-gray-500"
          }
          ${
            colorScheme == "facebook"
              ? "bg-blue-600"
              : colorScheme == "unfriend"
              ? "bg-red-500"
              : "bg-gray-500"
          }
          text-white 
          ${
            colorScheme == "facebook"
              ? "hover:bg-blue-700"
              : colorScheme == "unfriend"
              ? "hover:bg-red-600"
              : "hover:bg-gray-400"
          }
          transition-colors
          ease-in-out
          duration-300
        `}
        disabled={loading || disabled}
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
};

export default Submit