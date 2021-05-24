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
import Rating from '@material-ui/lab/Rating';

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

const getStoreReview = async (context) => await requestToBackend(context, `api/store-reviews/${context.query.id}/`, 'get', 'json');

const putStoreReview = async (storeReview, imageList) => {
  const processedStoreReview = {
    review: {
      article: {
        title: storeReview.title,
        content: storeReview.content,
        images: imageList.map(image => image.file),
      },
      score: storeReview.score,
    },
  };
  return await requestToBackend(null, `api/store-reviews/${storeReview.id}/`, 'put', 'multipart', convertJsonToFormData(processedStoreReview), null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const prevStoreReviewResponse = await getStoreReview(context);
  if (prevStoreReviewResponse.status === 404) {
    return {
      notFound: true
    }
  }
  if (!selfUser.staff && (selfUser.id !== prevStoreReviewResponse.data.review.article.user)) {
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: { lng, lngDict, selfUser, prevStoreReview: prevStoreReviewResponse.data }
  }
})

function Update({ lng, lngDict, selfUser, prevStoreReview }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [storeReview, setStoreReview] = useState({
    id: prevStoreReview.id,
    score: prevStoreReview.review.score,
    title: prevStoreReview.review.article.title,
    content: prevStoreReview.review.article.content,
    store: prevStoreReview.store,
  });
  const [storeReviewError, setStoreReviewError] = useState({
    title: false,
    content: false,
  });
  const [imageList, setImageList] = useState(prevStoreReview.review.article.images);

  useEffect(() => {
    const processedImageList = prevStoreReview.review.article.images;
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
  }, [prevStoreReview]);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('editReview')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('editReview')}
      />
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
      >
        <Box display='flex' justifyContent='center' paddingY={1}>
          <Rating
            value={storeReview.score}
            onChange={(event, newValue) => {
              setStoreReview(prevStoreReview => ({ ...prevStoreReview, score: newValue }));
            }}
            defaultValue={storeReview.score}
            size="large"
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='title'
            value={storeReview.title}
            error={storeReviewError.title}
            fullWidth
            label={i18n.t('title')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setStoreReview(prevStoreReview => ({ ...prevStoreReview, title: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='content'
            value={storeReview.content}
            error={storeReviewError.content}
            fullWidth
            label={i18n.t('content')}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setStoreReview(prevStoreReview => ({ ...prevStoreReview, content: event.target.value }));
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
            const response = await putStoreReview(storeReview, imageList);
            if (response.status === 200) {
              router.push(`/store-reviews/${response.data.id}/`);
              toast.success(i18n.t('_reviewSuccessfullyEdited'));
            } else if (response.status === 400) {
              setStoreReviewError(prevStoreReviewError => ({...prevStoreReviewError, title: !!response.data.title}));
              setStoreReviewError(prevStoreReviewError => ({...prevStoreReviewError, content: !!response.data.content}));
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
            pathname: '/store-reviews/delete/',
            query: { id: storeReview.id },
          })}
        >
          {i18n.t('deleteReview')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Update;
