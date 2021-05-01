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
import InfoIcon from '@material-ui/icons/Info';
import Rating from '@material-ui/lab/Rating';

import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList'
import Tile from 'components/Tile'
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
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

const postStoreReview = async (storeReview, imageList) => {
  const processedStoreReview = {
    review: {
      article: {
        title: storeReview.title,
        content: storeReview.content,
        images: imageList.map(image => image.file),
      },
      score: storeReview.score,
    },
    store: storeReview.store,
  };
  return await requestToBackend(null, 'api/store-reviews/', 'post', 'multipart', convertJsonToFormData(processedStoreReview), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeResponse = await getStore(context);
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
    props: { lng, lngDict, selfUser, store: storeResponse.data },
  }
})

function Create({ lng, lngDict, selfUser, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [storeReview, setStoreReview] = useState({
    score: 3,
    title: null,
    content: null,
    store: store.id
  });
  const [storeReviewError, setStoreReviewError] = useState({
    title: false,
    content: false,
  });
  const [imageList, setImageList] = useState([]);

  return (
    <Layout title={`가게 리뷰 추가 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 리뷰 추가'
      />
      <Section
        title='기본 정보'
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
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
            label='제목'
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
            label='내용'
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
            const response = await postStoreReview(storeReview, imageList);
            console.log(response.data);
            if (response.status === 201) {
              router.push(`/store-reviews/${response.data.id}/`);
              toast.success('가게 리뷰가 생성되었습니다.');
            } 
            else if (response.status === 400) {
              setStoreReviewError(prevStoreReviewError => ({...prevStoreReviewError, title: !!response.data.title}));
              setStoreReviewError(prevStoreReviewError => ({...prevStoreReviewError, content: !!response.data.content}));
              toast.error('입력란을 확인하세요.');
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
