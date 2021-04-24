import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import ArticleBox from '../../components/ArticleBox'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Id({ selfUser }) {

  const router = useRouter();
  const [storeNotice, setStoreNotice] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const storeNoticeResponse = await requestToBackend(`api/store-notices/${router.query.id}/`, 'get', 'json', null, null);
      const storeResponse = await requestToBackend(`api/stores/${storeNoticeResponse.data.store}/`, 'get', 'json', null, null);
      setStoreNotice(storeNoticeResponse.data);
      setStore(storeResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`${storeNotice.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={storeNotice.article.title}
      >
        <ArticleBox
          title={storeNotice.article.title}
          subtitle={new Date(storeNotice.article.created_at).toLocaleDateString()}
          image={
            storeNotice.article.images.length > 0
            ? storeNotice.article.images[0].image
            : '/no_image.png'
          }
          content={storeNotice.article.content}
        >
        </ArticleBox>
      </Section>
      {selfUser.id === store.user && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-notices/update/',
              query: { id: storeNotice.id },
            })}
          >
            공지사항 수정
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default withAuth(Id);
