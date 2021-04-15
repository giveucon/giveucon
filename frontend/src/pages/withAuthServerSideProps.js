import axios from 'axios';
import { getSession } from 'next-auth/client';
import requestToBackend from './requestToBackend';

const getSelfUser = async (session) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/self/`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export default function withAuthServerSideProps(getServerSidePropsFunc) {
  return async (context) => {

    // Get session from NextAuth
    const session = await getSession(context);
    if (session === null) {
      return {
        redirect: {
          permanent: false,
          destination: 'login/',
        },
        props: {}
      };
    }
    
    // const selfUserResponse = await getSelfUser(session);
    const selfUserResponse = await requestToBackend(session, 'api/users/self/', 'get', 'json');
    // If account founded but no user models linked
    if (selfUserResponse.status === 404) {
      return {
        redirect: {
          permanent: false,
          destination: 'users/create/',
        },
        props: {}
      }
    }
    const selfUser = selfUserResponse.data;

    // Return props after execute server side functions
    if (getServerSidePropsFunc) {
      return {
        props: {
          session,
          selfUser,
          ...((await getServerSidePropsFunc(context, session, selfUser)).props || {}),
        },
      }
    }

    return {
      props: {
        session,
        selfUser,
      },
    }

  }
}
