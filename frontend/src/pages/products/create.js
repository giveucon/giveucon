import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import Uppy from '@uppy/core'
import { Dashboard, useUppy } from '@uppy/react'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import convertJsonToFormData from '../../utils/convertJsonToFormData'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Create({ selfUser }) {

  const router = useRouter();
  const [store, setStore] = useState(null);
  const [product, setProduct] = useState({
    name: null,
    description: null,
    price: 0,
    duration: 0,
    images: [],
    store: null,
  });
  const [productError, setProductError] = useState({
    name: false,
    description: false,
    price: false,
    duration: false,
  });

  const postProduct = async (product) => {
    const processedProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      duration: product.duration + ' 00',
      images: product.images,
      store: product.store,
    };
    return await requestToBackend('/api/products/', 'post', 'multipart', convertJsonToFormData(processedProduct), null);
  };

  const uppy = useUppy(() => {
    return new Uppy()
    .on('file-added', (file) => {
      setProduct(prevProduct => ({ ...prevProduct, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setProduct(prevProduct => ({ ...prevProduct, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

  useEffect(() => {
    const fetch = async () => {
      const storeResponse = await requestToBackend(`api/stores/${router.query.store}`, 'get', 'json', null, null);
      setStore(storeResponse.data);
      setProduct(prevProduct => ({ ...prevProduct, store: storeResponse.data.id }));
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`상품 추가 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='상품 추가'
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
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
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
            const response = await postProduct(product);
            if (response.status === 201) {
              router.push(`/products/${response.data.id}/`);
              toast.success('상품이 생성되었습니다.');
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
              console.log(response.data);
            }
          }}
        >
          제출
        </Button>
      </Box>
    </Layout>
  );
}

export default withAuth(Create);
