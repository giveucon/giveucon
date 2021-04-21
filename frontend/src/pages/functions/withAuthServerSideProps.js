import { getSession } from 'next-auth/client';
import nookies from 'nookies'
import backendSWRFetcher from './backendSWRFetcher';

export default function withAuthServerSideProps(getServerSidePropsFunction, authType, keyword) {
  return async (ctx) => {

    const cookies = nookies.get(ctx);

    // If session is not found
    if (!cookies.giveucon) {
      return {
        redirect: {
          permanent: false,
          destination: '/login/',
        },
        props: {}
      };
    }
    
    const session = JSON.parse(cookies.giveucon);
    const selfUserResponse = await backendSWRFetcher('api/users/self/', 'get', 'json');

    // If account founded but no user models linked
    if (selfUserResponse.status === (403 || 404)) {
      return {
        redirect: {
          permanent: false,
          destination: '/users/create/',
        },
        props: {}
      }
    }
    const selfUser = selfUserResponse.data;

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return {
        props: {
          session,
          selfUser,
          ...((await getServerSidePropsFunction(ctx, session, selfUser)).props || {}),
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
