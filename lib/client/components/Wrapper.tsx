import React from "react";

interface WrapperProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Wrapper: React.FC<WrapperProps> = ({ children, size="md" }) => {
  return <div className={`max-w-screen-${size} mx-auto mt-8`}>{children}</div>;
};

export default Wrapper;
