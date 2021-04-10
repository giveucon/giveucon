import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ArticleBox from '../components/ArticleBox';
import Layout from '../components/Layout'
import Section from '../components/Section'

function Error({ statusCode }) {
  const router = useRouter();
  return (
    <Layout title={`${statusCode} 오류 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={`${statusCode} 오류`}
      >
        <ArticleBox
          title={`${statusCode} 오류입니다.`}
          image="https://user-images.githubusercontent.com/48160211/114258807-29658d80-9a04-11eb-9d16-e69499a351a7.gif"
          content={"??? : 안녕히계세요 여러분"}
          defaultExpanded={true}
        />
      </Section>
      <Box marginY={1}>
        <Button
          color="default"
          fullWidth
          variant="contained"
          onClick={() => router.back()}
        >
          뒤로가기
        </Button>
      </Box>
      <Box marginY={1}>
        <Button
          color="default"
          fullWidth
          variant="contained"
          onClick={() => router.push(`/`)}
        >
          홈으로 가기
        </Button>
      </Box>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error