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
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList'
import Tile from '../../components/Tile'
import convertImageToBase64 from '../../utils/convertImageToBase64'
import convertImageToFile from '../../utils/convertImageToFile'
import convertJsonToFormData from '../../utils/convertJsonToFormData'
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getCentralNotice = async (context) => {
  return await requestToBackend(context, `api/central-notices/${context.query.id}/`, 'get', 'json');
};

const putCentralNotice = async (centralNotice, imageList) => {
  const processedCentralNotice = {
    article: {
      title: centralNotice.title,
      content: centralNotice.content,
      images: imageList.map(image => image.file),
    },
  };
  return await requestToBackend(null, `api/central-notices/${centralNotice.id}/`, 'put', 'multipart', convertJsonToFormData(processedCentralNotice), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  if (!selfUser.staff) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  const prevCentralNoticeResponse = await getCentralNotice(context);
  return {
    props: { selfUser, prevCentralNotice: prevCentralNoticeResponse.data },
  };
})

function Update({ selfUser, prevCentralNotice }) {

  const router = useRouter();
  const classes = useStyles();
  const [centralNotice, setCentralNotice] = useState({
    id: prevCentralNotice.id,
    title: prevCentralNotice.article.title,
    content: prevCentralNotice.article.content,
  });
  const [centralNoticeError, setCentralNoticeError] = useState({
    title: false,
    content: false,
  });
  const [imageList, setImageList] = useState(prevCentralNotice.article.images);

  useEffect(() => {
    let processedImageList = prevCentralNotice.article.images;
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
    <Layout title={`공지사항 수정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='공지사항 수정'
      />
      <Section
        title='공지사항 정보'
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='title'
            value={centralNotice.title}
            error={centralNoticeError.title}
            fullWidth
            label='제목'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setCentralNotice(prevCentralNotice => ({ ...prevCentralNotice, title: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='content'
            value={centralNotice.content}
            error={centralNoticeError.content}
            fullWidth
            label='내용'
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setCentralNotice(prevCentralNotice => ({ ...prevCentralNotice, content: event.target.value }));
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
            const response = await putCentralNotice(centralNotice, imageList);
            if (response.status === 200) {
              router.push(`/central-notices/${response.data.id}/`);
              toast.success('공지사항이 업데이트 되었습니다.');
            } else if (response.status === 400) {
              setCentralNoticeError(prevCentralNoticeError => ({...prevCentralNoticeError, title: !!response.data.title}));
              setCentralNoticeError(prevCentralNoticeError => ({...prevCentralNoticeError, content: !!response.data.content}));
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
              pathname: '/central-notices/delete/',
              query: { id: centralNotice.id },
            })}
          >
            공지사항 삭제
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Update;
