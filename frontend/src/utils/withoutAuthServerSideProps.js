export default function withoutAuthServerSideProps(getServerSidePropsFunction) {
  return async (context) => {

    const defaultLng = 'ko'
    const { default: defaultLngDict = {} } = await import(`locales/${defaultLng}.json`);
    
    if (getServerSidePropsFunction) {
      return {
        props: {
          lng: defaultLng,
          lngDict: defaultLngDict,
          darkMode: false,
          ...((await getServerSidePropsFunction(context, defaultLng, defaultLngDict)).props || {}),
        },
      }
    }

    return {
      props: {
        lng: defaultLng,
        lngDict: defaultLngDict,
        darkMode: false,
      },
    }

  }
}
