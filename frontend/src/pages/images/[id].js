import React from 'react';
import Head from 'next/head';

import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getImage = async (context) => await requestToBackend(context, `api/images/${context.query.id}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const imageResponse = await getImage(context);
  if (imageResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, image: imageResponse.data }
  }
})

function Id({ image }) {

  const i18n = useI18n();

  return (
    <>
      <Head>
        <title>{`${i18n.t('images')} - ${i18n.t('_appName')}`}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <img
        src={image.image}
        alt='Image'
        height='auto'
        width='auto'
      />
    </>
  );
}

export default Id;
