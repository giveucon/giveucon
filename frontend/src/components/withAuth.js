import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client';
import Typography from '@material-ui/core/Typography';


export default function withAuth(Component) {
  return (props) => {
    const [session, loading] = useSession();
    const router = useRouter();
    const [self, setSelf] = useState('');
  
    const getSelf = async () => { 
      const result = async (session) => await axios.get(
        `http://localhost:8000/api/users/self`, {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        })
        .then(res => ({
          error: false,
          data: res.data,
        }))
        .catch((error) => ({
          error: true,
          data: ["failed", "failed"],
        }),
      );
      setSelf(result.data)
    }
  
    useEffect(() => {
      getSelf()
      if (self.user == null) {
        router.push('/components');
        return <Typography>Signup Required</Typography>;
      }
    },[])
  
    return <Component {...props} />
  }
}
