import getCookies from 'utils/getCookies';
import requestToBackend from 'utils/requestToBackend';
import setCookie from 'utils/setCookie';

export default function withAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const defaultLng = 'ko'
    const { default: defaultLngDict = {} } = await import(`locales/${defaultLng}.json`);
    
    const cookies = getCookies(context);
    // If session is not found
    if (!cookies.giveucon_session) {
      return {
        redirect: {
          permanent: false,
          destination: '/login/',
        },
        props: {
          lng: defaultLng,
          lngDict: defaultLngDict,
          darkMode: false,
        }
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
        props: {
          lng: defaultLng,
          lngDict: defaultLngDict,
          darkMode: false,
        }
      }
    }

    let selfUser = selfUserResponse.data;
    selfUser.menu_items = [
      'home', 'myWallet', 'stores', 'trades', 'myAccount'
    ];

    const { default: lngDict = {} } = await import(`locales/${selfUser.locale}.json`);

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return {
        props: {
          lng: selfUser.locale,
          lngDict,
          darkMode: selfUser.dark_mode,
          selfUser,
          ...((await getServerSidePropsFunction(context, selfUser.locale, lngDict, selfUser)).props || {}),
        },
      }
    }

    return {
      props: {
        lng: selfUser.locale,
        lngDict,
        darkMode: selfUser.dark_mode,
        selfUser
      },
    }

  }
}
