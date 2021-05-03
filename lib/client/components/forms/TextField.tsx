import React from "react";
import { useField } from 'formik'

interface TextFieldProps {
  name: string;
  type: string;
  textarea?: boolean 
}

const TextField: React.FC<TextFieldProps> = ({ textarea = false, ...props }) => {
  const [ field, { error } ] = useField(props)

  const getLabel = (name: string) => {
    if (name == 'confirmPassword') {
      return 'Confirm password'
    } else {
      return name.slice(0, 1).toUpperCase() + name.slice(1)
    }
  }

  const styles = `
    px-4 py-3
    border-2
    w-full
    mb-0
    rounded-md
    focus:outline-none
    bg-gray-800
    text-gray-100
    ${textarea ? "h-40" : null}
    ${error ? "border-red-400" : "border-gray-800"}
    hover:${error ? "border-red-400" : "border-gray-800"}
    focus:${error ? "border-red-400" : "border-blue-400"}
    transition
    ease-in-out
    duration-300
  `

  const otherProps = {
    id: field.name,
    placeholder: getLabel(field.name)
  }

  return (
    <div className="mb-3">
      <p className="indicator"> {getLabel(field.name)} </p>
      {
        textarea ? (
          <textarea
            {...otherProps}
            className={styles}
            {...field}
            {...props}
          />
        ) : (
          <input
            {...otherProps}
            className={styles}
            {...field}
            {...props}
          />
        )
      }
      {error && (
        <ul className="ml-4 mb-2 mt-2">
          {Object.keys(error).map((message: string, index: number) => (
            <li
              key={index}
              className="text-sm text-red-700 list-disc">
              {error[parseInt(message)]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextField;
