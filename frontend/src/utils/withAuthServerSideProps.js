import getCookies from './getCookies';
import requestToBackend from './requestToBackend';
import setCookie from './setCookie';

export default function withAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const cookies = getCookies(context);

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

    const session = JSON.parse(getCookies(context).giveucon);
    setCookie(context, 'giveucon', JSON.stringify({
      ...session,
      theme: selfUser.dark_mode ? 'dark' : 'light'
    }), {
      maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
      path: process.env.NEXT_PUBLIC_COOKIE_PATH,
    })

    
    const { default: lngDict = {} } = await import(`locales/${selfUser.locale}.json`);

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return {
        props: {
          lng: selfUser.locale,
          lngDict,
          selfUser,
          ...((await getServerSidePropsFunction(context, selfUser.locale, lngDict, selfUser)).props || {}),
        },
      }
    }

    return {
      props: { lng: selfUser.locale, lngDict, selfUser },
    }

  }
}
