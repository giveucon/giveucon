import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const deleteCentralNotice = async (centralNotice) => {
  return await requestToBackend(`api/central-notices/${centralNotice.id}/`, 'delete', 'json');
};

function Delete({ selfUser }) {

  const router = useRouter();
  const classes = useStyles();
  const [centralNotice, setCentralNotice] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const centralNoticeResponse = await requestToBackend(`api/central-notices/${router.query.id}/`, 'get', 'json', null, null);
      setCentralNotice(centralNoticeResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`공지사항 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='공지사항 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteCentralNotice(centralNotice);
              if (response.status === 204) {
                router.push(`/central-notices/`);
                toast.success('공지사항이 삭제되었습니다.');
              }
            }}
          >
            공지사항 삭제
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default withAuth(Delete);
