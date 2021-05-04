import React from "react";

interface ReactorProps {
  label: string;
  onClick?: () => any;
}

export const Reactor: React.FC<ReactorProps> = ({
  children,
  label,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex 
        p-3 py-2 mr-3
        bg-gray-700
        hover:bg-gray-600
        rounded-lg
        transition duration-100
      `}
    >
      {children}
      <p className="ml-2 text-gray-300">{label}</p>
    </button>
  );
};

export default Reactor;
