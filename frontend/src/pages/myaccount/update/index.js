import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import SettingsIcon from '@material-ui/icons/Settings';

import Layout from '../../../components/Layout'
import Section from '../../../components/Section'
import withAuth from '../../../utils/withAuth'

function Index({ selfUser }) {

  const router = useRouter();
  
  return (
    <Layout title={`설정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='설정'
      >
      </Section>
      <Section
        title='설정'
        titlePrefix={<IconButton><SettingsIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/myaccount/update/user/`)}
          >
            사용자 설정
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default withAuth(Index);
