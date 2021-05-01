import getCookies from 'utils/getCookies';
import requestToBackend from 'utils/requestToBackend';
import setCookie from 'utils/setCookie';

export default function withAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const cookies = getCookies(context);
    // If session is not found
    if (!cookies.giveucon_session) {
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

    let selfUser = selfUserResponse.data;
    selfUser.menuItems = [
      'home', 'myWallet', 'stores', 'trades', 'myAccount'
    ];

    setCookie(context, 'giveucon_settings', JSON.stringify({
      locale: selfUser.locale,
      dark_mode: selfUser.dark_mode
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
