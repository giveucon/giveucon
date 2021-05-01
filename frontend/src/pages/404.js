import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'

function Error404() {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout title={`404 오류 - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title='404 오류'
      >
        <AlertBox content='페이지를 찾을 수 없습니다.' variant='error' />
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

export default Error404;
