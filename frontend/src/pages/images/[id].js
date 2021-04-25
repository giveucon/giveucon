import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'

import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Id({ selfUser }) {

  const router = useRouter();
  const [image, setImage] = useState(null);

  const getImage = async () => {
    return await requestToBackend(`api/images/${router.query.id}/`, 'get', 'json', null, null);
  };

  useEffect(() => {
    const fetch = async () => {
      const imageResponse = await getImage();
      setImage(imageResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

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
