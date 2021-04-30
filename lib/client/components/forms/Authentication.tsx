import React, { Fragment } from "react";
import Submit from "../buttons/Submit";

interface Option {
  username: string;
  password: string;
  confirmPassword: string
}

interface AuthenticationProps {
  options: Option;
  setValues(value: Option): void
}

export const Authentication: React.FC<AuthenticationProps> = ({ options, setValues }) => {
  const getInputType = (option: string) => {
    if (option === "password" || option === "confirmPassword") {
      return "password";
    } else {
      return undefined;
    }
  };

  const getPlaceholder = (option: string) => {
    if (option === "confirmPassword") {
      return "Confirm password";
    } else {
      return option.charAt(0).toUpperCase() + option.slice(1);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(options)
  }

  return (
    <form onSubmit={onSubmit}>
      {Object.keys(options).map((option: string) => (
        <Fragment>
          <p className="text-sm font-medium text-gray-700 mb-2">
            {getPlaceholder(option)}
          </p>
          <input
            className="form-input"
            onChange={(e) => {
              const previous = Object.assign({}, options);
              if (option == "username") {
                previous.username = e.target.value
              } else if (option == "password") {
                previous.password = e.target.value
              } else if (option == "confirmPassword") {
                previous.confirmPassword = e.target.value
              }
              setValues(previous)
            }}
            type={getInputType(option)}
            placeholder={getPlaceholder(option)}
          />
        </Fragment>
      ))}
      <Submit label="Register" />
    </form>
  );
};

export default Authentication;
