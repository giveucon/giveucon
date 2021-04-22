import React, { useEffect, useState } from 'react';
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
  const [centralNotice, setCentralNotice] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const centralNoticeResponse = await requestToBackend(`api/central-notices/${router.query.id}/`, 'get', 'json', null, null);
      setCentralNotice(centralNoticeResponse.data);
    }
    fetch();
  }, []);
  if (!centralNotice) return <div>loading...</div>

  return (
    <Layout title={`${centralNotice.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={centralNotice.article.title}
      >
        <ArticleBox
          title={centralNotice.article.title}
          subtitle={new Date(centralNotice.article.created_at).toLocaleDateString()}
          image={
            centralNotice.article.images.length > 0
            ? centralNotice.article.images[0].image
            : '/no_image.png'
          }
          content={centralNotice.article.content}
        >
        </ArticleBox>
      </Section>
      {selfUser.staff && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/central-notices/update/',
              query: { id: centralNotice.id },
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
