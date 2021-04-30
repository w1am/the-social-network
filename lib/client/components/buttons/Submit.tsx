import React from 'react'

interface SubmitProps {
  label: string
}

export const Submit: React.FC<SubmitProps> = ({ label }) => {
  return (
    <div className="mt-5">
      <input
        className="px-4 py-2 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        type="submit"
        value={label}
      />
    </div>
  );
}

export default Submit