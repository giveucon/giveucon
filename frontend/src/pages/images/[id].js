import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'

import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

const getImage = async (context) => {
  return await requestToBackend(context, `api/images/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const imageResponse = await getImage(context);
  console.log(imageResponse.data);
  return {
    props: { selfUser, image: imageResponse.data },
  };
})

function Id({ selfUser, image }) {
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

export default withAuth(Id);
