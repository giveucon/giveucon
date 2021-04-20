import React from 'react';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../functions/requestToBackend'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const deleteSelfUser = async (session, selfUser) => {
  return await requestToBackend(session, `api/users/${selfUser.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { session, selfUser },
  }
})

function Delete({ session, selfUser }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={`계정 탈퇴 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='계정 탈퇴'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteSelfUser(session, selfUser);
              if (response.status === 204) {
                signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/` })
                toast.success('계정 탈퇴가 완료되었습니다.');
              }
            }}
          >
            계정 탈퇴
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

export default Delete;
