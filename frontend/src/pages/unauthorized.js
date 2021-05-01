import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'

function Unauthorized({}) {
  const router = useRouter();
  return (
    <Layout title={`권한 없음 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='권한 없음'
      >
        <AlertBox content='권한이 없습니다.' variant='error' />
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.back()}
          >
            뒤로가기
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/`)}
          >
            홈으로 가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Unauthorized;
