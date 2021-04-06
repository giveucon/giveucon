import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client';
import Typography from '@material-ui/core/Typography';


export default function withAuth(Component) {
  return (props) => {
    const router = useRouter();
    const [session, loading] = useSession();
    const [selfUser, setSelfUser] = useState('');
  
    const getSelfUser = async () => {
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
        setSelfUser(response.data);
      } catch (error) {
        if (error.response.status === 404) {
          router.push('/users/create');
        } else {
          console.log(error);
        }
      }
    };

    useEffect(() => {
      getSelfUser()
      console.log(self)
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
