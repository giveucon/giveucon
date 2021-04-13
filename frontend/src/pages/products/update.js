import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
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
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${context.query.id}`, {
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

const putProduct = async (session, product) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${product.id}/`, {
        name: product.name,
        description: product.description,
        price: product.price,
        duration: product.duration + " 00",
        store: product.store,
      }, {
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
  const prevProduct = await getProduct(session, context)
  return {
    props: { session, selfUser, prevProduct },
  }
})

function Update({ session, selfUser, prevProduct }) {
  const router = useRouter();
  const classes = useStyles();
  const [product, setProduct] = useState({
    id: prevProduct.id,
    name: prevProduct.name,
    description: prevProduct.description,
    price: prevProduct.price,
    duration: prevProduct.duration,
    store: prevProduct.store,
  });
  return (
    <Layout title={`상품 수정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="상품 수정"
      >
        <Box paddingY={1}>
          <TextField
            name="name"
            value={product.name}
            fullWidth
            label="이름"
            onChange={(event) => {
              setProduct({ ...product, name: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="description"
            value={product.description}
            fullWidth
            label="설명"
            multiline
            onChange={(event) => {
              setProduct({ ...product, description: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="price"
            value={product.price}
            fullWidth
            label="가격"
            type="number"
            onChange={(event) => {
              setProduct({ ...product, price: event.target.value });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  원
                </InputAdornment>
              ),
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="duration"
            value={product.duration}
            fullWidth
            type="number"
            label="유효기간"
            onChange={(event) => {
              setProduct({ ...product, duration: event.target.value });
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  일
                </InputAdornment>
              ),
            }}
            required
          />
        </Box>
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await putProduct(session, product);
              router.push(`/products/${response.data.id}`);
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
      <Section
        title="위험 구역"
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant="contained"
            onClick={() => router.push({
              pathname: '/products/delete',
              query: { id: store.id },
            })}
          >
            상품 삭제
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Update;
