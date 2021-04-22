import React, { useEffect, useState } from 'react';
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

const deleteProduct = async (product) => {
  return await requestToBackend(`api/products/${product.id}/`, 'delete', 'json');
};

function Delete({ selfUser }) {

  const router = useRouter();
  const classes = useStyles();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const productResponse = await requestToBackend(`api/products/${router.query.id}`, 'get', 'json', null, null);
      setProduct(productResponse.data);
    }
    fetch();
  }, []);
  if (!product) return <div>loading...</div>

  return (
    <Layout title={`상품 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='상품 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteProduct(product);
              if (response.status === 204) {
                router.push(`/stores/${product.store}/`);
                toast.success('상품이 삭제되었습니다.');
              }
            }}
          >
            상품 삭제
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
