import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import convertJsonToFormData from 'utils/convertJsonToFormData'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.id}/`, 'get', 'json');
};

const postProduct = async (product, imageList) => {
  const processedProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    duration: product.duration + ' 00',
    images: imageList.map(image => image.file),
    store: product.store,
  };
  return await requestToBackend(null, '/api/products/', 'post', 'multipart', convertJsonToFormData(processedProduct), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeResponse = await getStore(context);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser, store: storeResponse.data },
  };
})

function Create({ lng, lngDict, selfUser, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [product, setProduct] = useState({
    name: null,
    description: null,
    price: 0,
    duration: 0,
    store: store.id,
  });
  const [productError, setProductError] = useState({
    name: false,
    description: false,
    price: false,
    duration: false,
  });
  const [imageList, setImageList] = useState([]);

  return (
    <Layout title={`상품 추가 - ${i18n.t('_appName')}`}>
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
        padding={false}
      >
        <ImageUploading
          multiple
          value={imageList}
          onChange={(imageList) => {
            setImageList(imageList);
          }}
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps
          }) => (
            <>
              {imageList.length > 0 && (
                <SwipeableTileList half>
                  {imageList.map((item, index) => (
                    <Tile
                      key={index}
                      image={item.dataURL}
                      imageType='base64'
                      actions={
                        <IconButton><DeleteIcon onClick={() => onImageRemove(index)}/></IconButton>
                      }
                    />
                  ))}
                </SwipeableTileList>
              )}
              <Box padding={1}>
                <Box marginY={1}>
                  <Button
                    color='default'
                    fullWidth
                    variant='contained'
                    onClick={onImageUpload}
                  >
                    이미지 추가
                  </Button>
                </Box>
                {imageList.length > 0 && (
                  <Box marginY={1}>
                    <Button
                      className={classes.RedButton}
                      fullWidth
                      variant='contained'
                      onClick={onImageRemoveAll}
                    >
                      모든 이미지 삭제
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </ImageUploading>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await postProduct(product, imageList);
            if (response.status === 201) {
              router.push(`/products/${response.data.id}/`);
              toast.success('상품이 생성되었습니다.');
            } else if (response.status === 400) {
              setProductError(prevProductError => ({...prevProductError, name: !!response.data.name}));
              setProductError(prevProductError => ({...prevProductError, description: !!response.data.description}));
              setProductError(prevProductError => ({...prevProductError, price: !!response.data.price}));
              setProductError(prevProductError => ({...prevProductError, duration: !!response.data.duration}));
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

export default Create;
