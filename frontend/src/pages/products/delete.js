import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
    '&:hover': {
       background: '#aa2e25',
    },
  },
});

const getProduct = async (session, context) => {
  return await requestToBackend(session, `api/products/${context.query.id}/`, 'get', 'json');
};

const deleteProduct = async (session, product) => {
  return await requestToBackend(session, `api/products/${product.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const productResponse = await getProduct(session, context);
  return {
    props: { session, selfUser, product: productResponse.data },
  };
})

function Delete({ session, selfUser, product }) {
  const router = useRouter();
  const classes = useStyles();
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
              const response = await deleteProduct(session, product);
              if (response.status === 204) {
                router.push(`/stores/${product.store}/`);
                toast.success('상품이 삭제되었습니다.');
              } else {
                toast.error('상품 삭제 중 오류가 발생했습니다.');
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

export default Delete;
