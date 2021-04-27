import getCookies from './getCookies';
import requestToBackend from './requestToBackend';

export default function withAuthServerSideProps(getServerSidePropsFunction, authType, keyword) {
  return async (context) => {

    const cookies = getCookies(context)

    // If session is not found
    if (!cookies.giveucon) {
      return {
        redirect: {
          permanent: false,
          destination: '/login/',
        },
        props: {}
      }
    }
    
    const selfUserResponse = await requestToBackend(context, 'api/users/self/', 'get', 'json');

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

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return {
        props: {
          selfUser,
          ...((await getServerSidePropsFunction(context, selfUser)).props || {}),
        },
      }
    }

    return {
      props: {
        selfUser,
      },
    }

  }
}
