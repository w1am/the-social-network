import React, { useState } from 'react'
import Authentication from '../components/forms/Authentication'
import Wrapper from '../components/Wrapper'

export const register: React.FC<{}> = () => {
  const [ values, setValues ] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  })

  return (
    <Wrapper size="sm">
      <h1 className="text-3xl font-medium mb-8">Register</h1>
      <Authentication setValues={setValues} options={values} />
    </Wrapper>
  );
}

export default register