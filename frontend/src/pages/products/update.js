import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Uppy from '@uppy/core'
import { Dashboard, useUppy } from '@uppy/react'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

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

const getStore = async (session, product) => {
  return await requestToBackend(session, `api/stores/${product.store}/`, 'get', 'json');
};

const putProduct = async (session, product) => {
  const processedProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    duration: product.duration + ' 00',
    images: product.images,
    store: product.store,
  };
  return await requestToBackend(session, `api/products/${product.id}/`, 'put', 'multipart', jsonToFormData(processedProduct), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const prevProductResponse = await getProduct(session, context);
  const storeResponse = await getStore(session, prevProductResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  return {
    props: { session, selfUser, prevProduct: prevProductResponse.data },
  };
}, 'product', context.query.id)

function Update({ session, selfUser, prevProduct }) {
  const router = useRouter();
  const classes = useStyles();
  const [product, setProduct] = useState({
    id: prevProduct.id,
    name: prevProduct.name,
    description: prevProduct.description,
    price: prevProduct.price,
    duration: prevProduct.duration,
    images: prevProduct.images,
    store: prevProduct.store,
  });
  const [productError, setProductError] = useState({
    name: false,
    description: false,
    price: false,
    duration: false,
  });
  
  const uppy = useUppy(() => {
    return new Uppy()
    .on('files-added', (files) => {
      setProduct(prevProduct => ({ ...prevProduct, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setProduct(prevProduct => ({ ...prevProduct, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

  return (
    <Layout title={`상품 수정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='상품 수정'
      />
      <Section
        title='기본 정보'
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={product.name}
            error={productError.name}
            fullWidth
            label='이름'
            onChange={(event) => {
              setProduct(prevProduct => ({ ...prevProduct, name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='description'
            value={product.description}
            error={productError.description}
            fullWidth
            label='설명'
            multiline
            onChange={(event) => {
              setProduct(prevProduct => ({ ...prevProduct, description: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='price'
            value={product.price}
            error={productError.price}
            fullWidth
            label='가격'
            type='number'
            onChange={(event) => {
              setProduct(prevProduct => ({ ...prevProduct, price: event.target.value }));
            }}
            InputProps={{
              endAdornment: (<InputAdornment position='end'>원</InputAdornment>),
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='duration'
            value={product.duration}
            error={productError.duration}
            fullWidth
            type='number'
            label='유효기간'
            onChange={(event) => {
              setProduct(prevProduct => ({ ...prevProduct, duration: event.target.value }));
            }}
            InputProps={{
              endAdornment: (<InputAdornment position='end'>일</InputAdornment>),
            }}
            required
          />
        </Box>
      </Section>
      <Section
        title='이미지'
        titlePrefix={<IconButton><ImageIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <Dashboard
            uppy={uppy}
            height={'20rem'}
            hideCancelButton
            hideUploadButton
          />
        </Box>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await putProduct(session, product);
            if (response.status === 200) {
              router.push(`/products/${response.data.id}/`);
              toast.success('상품이 업데이트 되었습니다.');
            } else if (response.status === 400) {
              if (response.data.name) {
                setProductError(prevProductError => ({...prevProductError, name: true}));
              } else {
                setProductError(prevProductError => ({...prevProductError, name: false}));
              }
              if (response.data.description) {
                setProductError(prevProductError => ({...prevProductError, description: true}));
              } else {
                setProductError(prevProductError => ({...prevProductError, description: false}));
              }
              if (response.data.price) {
                setProductError(prevProductError => ({...prevProductError, price: true}));
              } else {
                setProductError(prevProductError => ({...prevProductError, price: false}));
              }
              if (response.data.duration) {
                setProductError(prevProductError => ({...prevProductError, duration: true}));
              } else {
                setProductError(prevProductError => ({...prevProductError, duration: false}));
              }
              toast.error('입력란을 확인하세요.');
            }
          }}
        >
          제출
        </Button>
      </Box>
      <Section
        title='위험 구역'
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
      <Box marginY={1}>
        <Button
          className={classes.RedButton}
          fullWidth
          variant='contained'
          onClick={() => router.push({
            pathname: '/products/delete',
            query: { id: product.id },
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
