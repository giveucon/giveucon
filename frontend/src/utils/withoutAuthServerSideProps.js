import getCookies from 'utils/getCookies';

export default function withoutAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const cookies = getCookies(context);
    const settings = cookies.giveucon_settings ? JSON.parse(cookies.giveucon_settings) : undefined;

    const lng = settings ? settings.locale : 'ko';
    const { default: lngDict = {} } = await import(`locales/${lng}.json`);

    if (getServerSidePropsFunction) {
      return await getServerSidePropsFunction(context, lng, lngDict);
    } 
    return {
      props: { lng, lngDict }
    }

  }
}
