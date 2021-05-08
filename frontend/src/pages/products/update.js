import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import * as constants from 'constants';
import AmountInputBox from 'components/AmountInputBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList'
import Tile from 'components/Tile'
import useI18n from 'hooks/useI18n'
import convertImageToBase64 from 'utils/convertImageToBase64'
import convertImageToFile from 'utils/convertImageToFile'
import convertJsonToFormData from 'utils/convertJsonToFormData'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');
};

const getStore = async (context, product) => {
  return await requestToBackend(context, `api/stores/${product.store}/`, 'get', 'json');
};

const putProduct = async (product, imageList) => {
  const processedProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    duration: product.duration + ' 00',
    images: imageList.map(image => image.file),
    store: product.store,
  };
  return await requestToBackend(null, `api/products/${product.id}/`, 'put', 'multipart', convertJsonToFormData(processedProduct), null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const prevProductResponse = await getProduct(context);
  if (prevProductResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeResponse = await getStore(context, prevProductResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser, prevProduct: prevProductResponse.data }
  }
})

function Update({ lng, lngDict, selfUser, prevProduct }) {

  const i18n = useI18n();
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
  const [productError, setProductError] = useState({
    name: false,
    description: false,
    price: false,
    duration: false,
  });
  const [imageList, setImageList] = useState(prevProduct.images);

  useEffect(() => {
    let processedImageList = prevProduct.images;
    const injectDataUrl = async () => {
      for (const image in processedImageList) {
        await convertImageToBase64(processedImageList[image].image, (dataURL) => {
          processedImageList[image].dataURL = dataURL;
        });
        await convertImageToFile(processedImageList[image].image, processedImageList[image].image, (file) => {
          processedImageList[image].file = file;
        });
      }
      setImageList(processedImageList);
    }
    injectDataUrl();
  }, []);

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('editProduct')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('editProduct')}
      />
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={product.name}
            error={productError.name}
            fullWidth
            label={i18n.t('name')}
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
            label={i18n.t('description')}
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
          <AmountInputBox
            variant='money'
            label={i18n.t('price')}
            lng={lng}
            lngDict={lngDict}
            addAmountList={constants.MONEY_AMOUNT_LIST}
            onChangeAmount={(amount) => {
              setProduct(prevProduct => ({ ...prevProduct, price: amount }));
            }}
          />
        </Box>
        <Box paddingY={1}>
          <AmountInputBox
            variant='date'
            label={i18n.t('duration')}
            lng={lng}
            lngDict={lngDict}
            addAmountList={constants.DATE_AMOUNT_LIST}
            onChangeAmount={(amount) => {
              setProduct(prevProduct => ({ ...prevProduct, duration: amount }));
            }}
          />
        </Box>
      </Section>
      <Section
        title={i18n.t('images')}
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
                    {i18n.t('addImages')}
                  </Button>
                </Box>
                {imageList.length > 0 && (
                  <Box marginY={1}>
                    <Button
                      className={classes.errorButton}
                      fullWidth
                      variant='contained'
                      onClick={onImageRemoveAll}
                    >
                      {i18n.t('deleteAllImages')}
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
            const response = await putProduct(product, imageList);
            if (response.status === 200) {
              router.push(`/products/${response.data.id}/`);
              toast.success(i18n.t('_productSuccessfullyEdited'));
            } else if (response.status === 400) {
              setProductError(prevProductError => ({...prevProductError, name: !!response.data.name}));
              setProductError(prevProductError => ({...prevProductError, description: !!response.data.description}));
              setProductError(prevProductError => ({...prevProductError, price: !!response.data.price}));
              setProductError(prevProductError => ({...prevProductError, duration: !!response.data.duration}));
              toast.error(i18n.t('_checkInputFields'));
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
      <Box marginY={1}>
        <Button
          className={classes.errorButton}
          fullWidth
          variant='contained'
          onClick={() => router.push({
            pathname: '/products/delete',
            query: { id: product.id },
          })}
        >
          {i18n.t('deleteProduct')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Update;
