import React from 'react';
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

function Delete({ selfUser }) {

  const router = useRouter();
  const classes = useStyles();
  const [storeNotice, setStoreNotice] = useState(null);

  const getStoreNotice = async () => {
    return await requestToBackend(`api/store-notices/${router.query.id}`, 'get', 'json', null, null);
  };

  const deleteStoreNotice = async (storeNotice) => {
    return await requestToBackend(`api/store-notices/${storeNotice.id}/`, 'delete', 'json');
  };

  useEffect(() => {
    const fetch = async () => {
      const storeNoticeResponse = await getStoreNotice();
      setStoreNotice(storeNoticeResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`가게 공지사항 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 공지사항 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteStoreNotice(storeNotice);
              if (response.status === 204) {
                router.push(`/stores/${storeNotice.store}/`);
                toast.success('가게 공지사항이 삭제되었습니다.');
              }
            }}
          >
            가게 공지사항 삭제
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
