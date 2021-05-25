import React, { useState } from 'react';
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

import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList'
import Tile from 'components/Tile'
import useI18n from 'hooks/useI18n'
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

const postStoreNotice = async (storeNotice, imageList) => {
  const processedStoreNotice = {
    article: {
      title: storeNotice.title,
      content: storeNotice.content,
      images: imageList.map(image => image.file),
    },
    store: storeNotice.store,
  };
  return await requestToBackend(null, 'api/store-notices/', 'post', 'multipart', convertJsonToFormData(processedStoreNotice), null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeResponse = await getStore(context);
  if (storeResponse.status === 404) {
    return {
      notFound: true
    }
  }
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: { lng, lngDict, selfUser, store: storeResponse.data }
  }
})

function Create({ lng, lngDict, selfUser, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [storeNotice, setStoreNotice] = useState({
    title: null,
    content: null,
    store: store.id
  });
  const [storeNoticeError, setStoreNoticeError] = useState({
    title: false,
    content: false,
  });
  const [imageList, setImageList] = useState([]);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('addNotice')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('addNotice')}
      />
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='title'
            value={storeNotice.title}
            error={storeNoticeError.title}
            fullWidth
            label={i18n.t('title')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, title: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='content'
            value={storeNotice.content}
            error={storeNoticeError.content}
            fullWidth
            label={i18n.t('content')}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, content: event.target.value }));
            }}
            required
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
          {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove }) => (
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
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await postStoreNotice(storeNotice, imageList);
            if (response.status === 201) {
              router.push(`/store-notices/${response.data.id}/`);
              toast.success(i18n.t('_noticeAdded'));
            }
            else if (response.status === 400) {
              setStoreNoticeError(prevStoreNoticeError => ({...prevStoreNoticeError, title: !!response.data.title}));
              setStoreNoticeError(prevStoreNoticeError => ({...prevStoreNoticeError, content: !!response.data.content}));
              toast.error(i18n.t('_checkInputFields'));
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Create;
