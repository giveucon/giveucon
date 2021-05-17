import getCookies from 'utils/getCookies';

export default function withoutAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const cookies = getCookies(context);
    const temp = cookies.giveucon_temp ? JSON.parse(cookies.giveucon_temp) : undefined;

    const lng = temp ? temp.lng : 'ko';
    const { default: lngDict = {} } = await import(`locales/${lng}.json`);

    if (getServerSidePropsFunction) {
      return await getServerSidePropsFunction(context, lng, lngDict);
    } 
    return {
      props: { lng, lngDict }
    }

  }
}
