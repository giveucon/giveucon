import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
    '&:hover': {
       background: "#aa2e25",
    },
  },
});

const getProduct = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${context.query.id}`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status }
  }
};

const deleteProduct = async (session, product) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${product.id}`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const productResponse = await getProduct(session, context)
  return {
    props: { session, selfUser, product: productResponse.data },
  }
})

function Delete({ session, selfUser, product }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={`상품 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        title="상품 삭제"
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Typography>경고: 이 작업 후에는 되돌릴 수 없습니다.</Typography>
        </Box>
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await deleteProduct(session, product);
              router.push(`/stores/${product.store}`);
            }}
          >
            가게 삭제
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {router.back()}}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Delete;
