import getSession from 'utils/getSession';
import requestToBackend from 'utils/requestToBackend';
import setCookie from 'utils/setCookie';

export default function withAuthServerSideProps (getServerSidePropsFunction) {
  return async (context) => {

    // If session is not found
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/login/',
        }
      }
    }

    const selfUserResponse = await requestToBackend(context, 'api/users/self/', 'get', 'json');
    // If account founded but no user models linked
    if (selfUserResponse.status === 403 || selfUserResponse.status === 404) {
      return {
        redirect: {
          permanent: false,
          destination: '/users/create/',
        }
      }
    }

    let selfUser = selfUserResponse.data;
    selfUser.menu_items = [ 'home', 'myWallet', 'stores', 'trades', 'myAccount' ];
    const { default: lngDict = {} } = await import(`locales/${selfUser.locale}.json`);
    const settings = {
      'dark_mode': selfUser.dark_mode,
      'locale': selfUser.locale
    };
    setCookie(context, 'giveucon_settings', JSON.stringify(settings), {
      maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
      path: process.env.NEXT_PUBLIC_COOKIE_PATH,
    })

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return await getServerSidePropsFunction(context, selfUser.locale, lngDict, selfUser.dark_mode, selfUser);
    } else return {
      props: {
        lng: selfUser.locale,
        lngDict,
        darkMode: selfUser.dark_mode,
        selfUser
      },
    }

  }
}
