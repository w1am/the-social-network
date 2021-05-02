import React from 'react'

interface FormikProps {
  options: Object
}

export const Formik: React.FC<FormikProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
}

export default Formik