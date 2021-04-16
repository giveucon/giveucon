import { getSession } from 'next-auth/client';
import requestToBackend from './requestToBackend';

export default function withAuthServerSideProps(authType, getServerSidePropsFunction) {
  return async (context) => {

    // Get session from NextAuth
    const session = await getSession(context);

    // If session is not found
    if (session === null) {
      return {
        redirect: {
          permanent: false,
          destination: '/login/',
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
          destination: '/users/create/',
        },
        props: {}
      }
    }
    const selfUser = selfUserResponse.data;

    if (authType === 'staff') {
      if (selfUser.staff === false) {
        return {
          redirect: {
            permanent: false,
            destination: '/unauthorized/',
          },
          props: {}
        }
      }
    }

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return {
        props: {
          session,
          selfUser,
          ...((await getServerSidePropsFunction(context, session, selfUser)).props || {}),
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
