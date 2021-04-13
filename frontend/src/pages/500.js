import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ArticleBox from '../components/ArticleBox';
import Layout from '../components/Layout'
import Section from '../components/Section'

function Error500({}) {
  const router = useRouter();
  return (
    <Layout title={`500 오류 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="500 오류"
      >
        <ArticleBox
          title="서버 내부 오류입니다."
          image="https://user-images.githubusercontent.com/48160211/114258807-29658d80-9a04-11eb-9d16-e69499a351a7.gif"
          content={"서버가 이 세상의 모든 굴레와 속박을 벗어 던졌습니다."}
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
  );
}

export default Error500;
