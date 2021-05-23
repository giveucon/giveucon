import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import KakaoMapBox from 'components/KakaoMapBox';
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
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

const getStore = async (context) => await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');

const getTagList = async (context) => await requestToBackend(context, 'api/tags/', 'get', 'json');

const putStore = async (store, imageList) => {
  const processedStore = {
    ...store,
    images: imageList.map(image => image.file),
  }
  return await requestToBackend(null, `api/stores/${store.id}/`, 'put', 'multipart', convertJsonToFormData(processedStore), null);
};

const getStoreLocation = async (store) => await requestToBackend(null, 'api/store-locations/', 'get', 'json', null, {
    store: store.id
  });

const putStoreLocation = async (store, storeLocation, location) => {
  console.log(storeLocation)
  const data = {
    store: store.id,
    location
  };
  return await requestToBackend(null, `/api/store-locations/${storeLocation.id}/`, 'put', 'json', data, null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const prevStoreResponse = await getStore(context);
  if (prevStoreResponse.status === 404) {
    return {
      notFound: true
    }
  }
  if (!selfUser.staff && (selfUser.id !== prevStoreResponse.data.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  const tagListResponse = await getTagList(context);
  if (tagListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      prevStore: prevStoreResponse.data,
      tagList: tagListResponse.data
    }
  }
})

function Update({ lng, lngDict, selfUser, prevStore, tagList }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [store, setStore] = useState({
    id: prevStore.id,
    name: prevStore.name,
    description: prevStore.description,
    tags: prevStore.tags,
  });
  const [storeError, setStoreError] = useState({
    name: false,
    description: false,
  });
  const [imageList, setImageList] = useState(prevStore.images);
  const [location, setLocation] = useState({
    latitude: prevStore.location.latitude,
    longitude: prevStore.location.longitude
  });
  const [address, setAddress] = useState('');

  useEffect(() => {
    const processedImageList = prevStore.images;
    const injectDataUrl = async () => {
      for (let i = 0; i < processedImageList.length; i++) {
        await convertImageToBase64(processedImageList[i].image, (dataURL) => {
          processedImageList[i].dataURL = dataURL;
        });
        await convertImageToFile(processedImageList[i].image, processedImageList[i].image, (file) => {
          processedImageList[i].file = file;
        });
      }
      setImageList(processedImageList);
    }
    injectDataUrl();
  }, []);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('editStore')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('editStore')}
      />
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={store.name}
            error={storeError.name}
            fullWidth
            label={i18n.t('name')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setStore(prevStore => ({ ...prevStore, name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='description'
            value={store.description}
            error={storeError.description}
            fullWidth
            label={i18n.t('description')}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setStore(prevStore => ({ ...prevStore, description: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <Autocomplete
            multiple
            options={tagList || []}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setStore(prevStore => ({ ...prevStore, tags: value.map(value => value.id) }));
            }}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                  checkedIcon={<CheckBoxIcon fontSize='small' />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </>
            )}
            style={{ minWidth: '2rem' }}
            renderInput={(params) => (
              <TextField {...params} label={i18n.t('tags')} placeholder={i18n.t('tags')} />
            )}
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
                      key={item.id}
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


      <Section
        title={i18n.t('location')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
      >
        <Card>
          <KakaoMapBox
            location={location}
            setLocation={setLocation}
            setAddress={setAddress}
            enablePinMove
          />
        </Card>
        <Box paddingY='0.5rem'>
          <Typography>{address}</Typography>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {
              new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
              }).then(
                (location) => setLocation({
                  latitude: location.coords.latitude, longitude: location.coords.longitude
                })
              );
            }}
          >
            {i18n.t('findCurrentLocation')}
          </Button>
        </Box>
      </Section>


      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const putStoreResponse = await putStore(store, imageList);
            if (putStoreResponse.status === 200) {
              const getStoreLocationResponse = await getStoreLocation(store);
              console.log(getStoreLocationResponse.data[0])
              const putStoreLocationResponse = await putStoreLocation(store, getStoreLocationResponse.data[0], location);
              if (putStoreLocationResponse.status === 200) {
                router.push(`/stores/${putStoreResponse.data.id}/`);
                toast.success(i18n.t('_storeSuccessfullyEdited'));
              } else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
                console.log(putStoreLocationResponse);
              }
            } else if (putStoreResponse.status === 400) {
              setStoreError(prevStoreError => ({...prevStoreError, name: !!putStoreResponse.data.name}));
              setStoreError(prevStoreError => ({...prevStoreError, description: !!putStoreResponse.data.description}));
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
            pathname: '/stores/delete/',
            query: { id: store.id },
          })}
        >
          {i18n.t('deleteStore')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Update;
