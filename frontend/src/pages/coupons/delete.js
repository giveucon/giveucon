import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
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

const deleteCoupon = async (coupon) => {
  return await requestToBackend(`api/coupons/${coupon.id}/`, 'delete', 'json');
};

function Delete({ selfUser }) {

  const router = useRouter();
  const classes = useStyles();
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const couponResponse = await requestToBackend(`api/coupons/${router.query.id}`, 'get', 'json', null, null);
      setCoupon(couponResponse.data);
    }
    fetch();
  }, []);
  if (!coupon) return <div>loading...</div>

  return (
    <Layout title={`쿠폰 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='쿠폰 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteCoupon(coupon);
              if (response.status === 204) {
                router.push(`/coupons/`);
                toast.success('쿠폰이 삭제되었습니다.');
              }
            }}
          >
            가게 삭제
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
