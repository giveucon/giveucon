import React, { useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStore = async (session, context) => {
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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const postProduct = async (session, product) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/products/", {
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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const store = await getStore(session, context)
  return {
    props: { session, selfUser, store },
  }
})

function Create({ session, selfUser, store }) {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    store: store.id,
  });
  return (
    <Layout title={`상품 추가 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="상품 추가"
      >
        <Box paddingY={1}>
          <TextField
            name="username"
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
            name="email"
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
            name="username"
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
            name="username"
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
              const response = await postProduct(session, product);
              router.push(`/products/${response.id}`);
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Create;
