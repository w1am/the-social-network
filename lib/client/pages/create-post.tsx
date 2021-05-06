import React from "react";
import Wrapper from "../components/Wrapper";
import { Formik, Form } from "formik";
import TextField from "../components/forms/TextField";
import Submit from "../components/buttons/Submit";
import { FieldError, useCreatePostMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from 'next/router'
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface CreatePostProps {}

export const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const [ ,createPost ] = useCreatePostMutation()
  const router = useRouter()
  return (
    <Wrapper size="sm">
      <h1 className="page-header">Create Post</h1>

      <Formik
        initialValues={{ description: "" }}
        onSubmit={async (values, { setErrors }) => {
          let errors : FieldError[] = []
          if (values.description.trim().length < 1) {
            errors.push({ field: "description", message: "Please enter something" })
            setErrors(toErrorMap([...errors]));
          } else {
            await createPost(values)
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField textarea={true} name="description" type="text" />
            <Submit label="Submit" loading={isSubmitting} />
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
// export default CreatePost;
