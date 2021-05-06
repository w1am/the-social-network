import React from "react";
import Submit from "../components/buttons/Submit";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { Formik, Form } from "formik";
import TextField from "../components/forms/TextField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from 'next/router';
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface RegisterProps {}

const login: React.FC<RegisterProps> = () => {
  const router = useRouter()
  const [ ,login ] = useLoginMutation();
  return (
    <Wrapper size="sm">
      <h1 className="page-header">Login</h1>

      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (
          { username, password },
          { setErrors }
        ) => {
          let errors = [];
          if (!username)
            errors.push({ field: "username", message: "username is required" });
          if (!password)
            errors.push({ field: "password", message: "password is required" });

          const response = await login({ username, password });
          if (response.data?.login.errors) {
            setErrors(
              toErrorMap([...response.data?.login.errors, ...errors])
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
            <Submit separator={true} label="Login" loading={isSubmitting} />
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(login);