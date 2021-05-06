import cookies from 'js-cookie';

export const verifyUser = () => {
  const user = cookies.getJSON('qid')
  console.log(user)
}