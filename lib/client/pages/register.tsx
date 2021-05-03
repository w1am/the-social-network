import React from "react";
import Submit from "../components/buttons/Submit";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { Formik, Form } from "formik";
import TextField from "../components/forms/TextField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from 'next/router';

interface RegisterProps {}

const register: React.FC<RegisterProps> = () => {
  const router = useRouter()
  const [, register] = useRegisterMutation();
  return (
    <Wrapper size="sm">
      <h1 className="page-header">Register</h1>

      <Formik
        initialValues={{ username: "", password: "", confirmPassword: "" }}
        onSubmit={async (
          { username, password, confirmPassword },
          { setErrors }
        ) => {
          let errors = [];
          if (!username)
            errors.push({ field: "username", message: "username is required" });
          if (!password || !confirmPassword)
            errors.push({ field: "password", message: "password is required" });
          if (password !== confirmPassword)
            errors.push({ field: "confirmPassword", message: "passwords do not match" });

          const response = await register({ username, password });
          if (response.data?.register.errors) {
            setErrors(
              toErrorMap([...response.data?.register.errors, ...errors])
            );
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField name="username" type="text" />
            <TextField name="password" type="password" />
            <TextField name="confirmPassword" type="password" />
            <Submit label="Register" loading={isSubmitting} />
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
