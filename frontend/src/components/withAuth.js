import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Typography from '@material-ui/core/Typography';

const fetchCurrentAccount = async (session) => await axios.get(
  `http://localhost:8000/api/users/self`, {
    headers: {
      'Authorization': "Bearer " + session?.accessToken,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  })
  .then((response) => {
    console.log(response.data);
    return { data: response.data };
  })
  .catch((error) => {
    console.log(error);
    return { error: error };
  }
);

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const account = await fetchCurrentAccount(session);

  return {
    props: {
      account: account
    },
  };
}

export default function withAuth(Component) {
  return (props) => {
    const router = useRouter();
    if (false) {
      router.push('/signup');
      return <Typography>Signup Required</Typography>;
    }
    return <Component {...props} />
  }
}
