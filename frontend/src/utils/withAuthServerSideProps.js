import getSession from 'utils/getSession';
import requestToBackend from 'utils/requestToBackend';
import setCookie from 'utils/setCookie';
import destroyCookie from 'utils/destroyCookie';

export default function withAuthServerSideProps (getServerSidePropsFunction) {
  return async (context) => {

    // If session is not found
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          destination: '/login/',
          permanent: false
        }
      }
    }

    const selfAccountResponse = await requestToBackend(context, 'api/accounts/self/', 'get', 'json');
    // If account not found
    if (selfAccountResponse.status === 403 || selfAccountResponse.status === 404) {
      destroyCookie(context, 'giveucon_session', {
        maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
        path: process.env.NEXT_PUBLIC_COOKIE_PATH,
      });
      return {
        redirect: {
          destination: '/login/',
          permanent: false
        }
      }
    }

    const selfUserResponse = await requestToBackend(context, 'api/users/self/', 'get', 'json');
    // If account found but no user models linked
    if (selfUserResponse.status === 403 || selfUserResponse.status === 404) {
      return {
        redirect: {
          destination: '/users/create/',
          permanent: false
        }
      }
    }

    let selfUser = selfUserResponse.data;
    selfUser.menu_items = [ 'home', 'myWallet', 'stores', 'trades', 'myAccount' ];
    const { default: lngDict = {} } = await import(`locales/${selfUser.locale}.json`);
    const settings = {
      ...session,
      settings: {
        'dark_mode': selfUser.dark_mode,
        'locale': selfUser.locale
      }
    };
    setCookie(context, 'giveucon_session', JSON.stringify(settings), {
      maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
      path: process.env.NEXT_PUBLIC_COOKIE_PATH
    })

    // Return props after execute server side functions
    if (getServerSidePropsFunction) {
      return await getServerSidePropsFunction(context, selfUser.locale, lngDict, selfUser);
    } else return {
      props: {
        lng: selfUser.locale,
        lngDict,
        selfUser
      },
    }

  }
}
