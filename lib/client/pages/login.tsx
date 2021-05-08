import React from "react";
import Submit from "../components/buttons/Submit";
import Wrapper from "../components/Wrapper";
import { MeQuery, useLoginMutation } from "../generated/graphql";
import { Formik, Form } from "formik";
import TextField from "../components/forms/TextField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import { MeDocument } from '../generated/graphql'

interface RegisterProps {}

const login: React.FC<RegisterProps> = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Wrapper size="sm">
      <h1 className="page-header">Login</h1>

      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async ({ username, password }, { setErrors }) => {
          let errors = [];
          if (!username)
            errors.push({ field: "username", message: "username is required" });
          if (!password)
            errors.push({ field: "password", message: "password is required" });

          const response = await login({
            variables: { username, password },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user
                }
              })
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap([...response.data?.login.errors, ...errors]));
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

export default withApollo({ ssr: false })(login);
// export default login;