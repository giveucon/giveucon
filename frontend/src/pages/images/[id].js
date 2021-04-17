import React from 'react';
import Head from 'next/head';

import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getImage = async (session, context) => {
  return await requestToBackend(session, `api/images/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const imageResponse = await getImage(session, context);
  console.log(imageResponse.data);
  return {
    props: { session, selfUser, image: imageResponse.data },
  };
})

function Id({ session, selfUser, image }) {
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
