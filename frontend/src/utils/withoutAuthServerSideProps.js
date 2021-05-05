import getCookies from 'utils/getCookies';

export default function withoutAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const cookies = getCookies(context);
    const settings = cookies.giveucon_settings ? JSON.parse(cookies.giveucon_settings) : undefined;

    const lng = settings ? settings.locale : 'ko';
    const { default: lngDict = {} } = await import(`locales/${lng}.json`);
    const darkMode = settings ? settings.dark_mode : false;

    if (getServerSidePropsFunction) {
      return await getServerSidePropsFunction(context, lng, lngDict, darkMode);
    } 
    return {
      props: { lng, lngDict, darkMode }
    }

  }
}
