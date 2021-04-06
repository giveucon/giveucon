import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client';
import Typography from '@material-ui/core/Typography';


export default function withAuth(Component) {
  return (props) => {
    const [session, loading] = useSession();
    const [self, setSelf] = useState('');
    const router = useRouter();
  
    const getSelf = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/self`, {
            headers: {
              'Authorization': "Bearer " + session?.accessToken,
              'Content-Type': 'application/json',
              'accept': 'application/json'
            }
          }
        );
        setSelf(response.data);
      } catch (error) {
        console.error(error);
        setSelf('');
      }
    };

    useEffect(() => {
      getSelf()
      console.log(self)
      if (self == '') {
        router.push('/users/create');
        return <Typography>Signup Required</Typography>;
      }
    },[])
    return <Component {...props} />
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}
