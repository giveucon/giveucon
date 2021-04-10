import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client';

const getSelfUser = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/self", {
        headers: {
          'Authorization': "Bearer " + session?.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
    } else {
      console.log(error);
    }
    return error;
  }
};

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfUser = await getSelfUser(session)
  console.log(session);
  if (session !== undefined) {
    if (selfUser.response.status === 404) {
      return {
        redirect: {
          permanent: false,
          destination: "/users/create",
        },
        props: {}
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/components",
        },
        props: {}
      }
    }
  } else {
    return {
      props: { session, selfUser }
    }
  }
}

export default function withAuth( Component ) {
  return (props) => {
    return <Component {...props} />
  }
}
