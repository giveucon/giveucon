import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'

import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getImage = async (context) => {
  return await requestToBackend(context, `api/images/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const imageResponse = await getImage(context);
  console.log(imageResponse.data);
  return {
    props: { lng, lngDict, selfUser, image: imageResponse.data },
  };
})

function Id({ lng, lngDict, selfUser, image }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>{`이미지 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}</title>
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
