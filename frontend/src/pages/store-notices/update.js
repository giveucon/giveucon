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
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import jsonToFormData from '../jsonToFormData'
import requestToBackend from '../functions/requestToBackend'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getStoreNotice = async (session, context) => {
  return await requestToBackend(session, `api/store-notices/${context.query.id}/`, 'get', 'json');
};

const getStore = async (session, StoreNotice) => {
  return await requestToBackend(session, `api/stores/${StoreNotice.store}/`, 'get', 'json');
};

const putStoreNotice = async (session, storeNotice) => {
  const processedStoreNotice = {
    article: {
      title: storeNotice.title,
      content: storeNotice.content,
      images: storeNotice.images,
    },
    store: storeNotice.store,
  };
  return await requestToBackend(session, 'api/store-notices/', 'put', 'multipart', jsonToFormData(processedStoreNotice), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const prevStoreNoticeResponse = await getStoreNotice(session, context);
  const storeResponse = await getStore(session, prevStoreNoticeResponse.data);
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
    props: { session, selfUser, prevStoreNotice: prevStoreNoticeResponse.data },
  };
})

function Update({ session, selfUser, prevStoreNotice }) {
  const router = useRouter();
  const classes = useStyles();
  const [storeNotice, setStoreNotice] = useState({
    id: prevStoreNotice.id,
    title: prevStoreNotice.title,
    content: prevStoreNotice.content,
    images: prevStoreNotice.images,
    store: prevStoreNotice.store,
  });
  const [storeNoticeError, setStoreNoticeError] = useState({
    title: false,
    content: false,
  });
  
  const uppy = useUppy(() => {
    return new Uppy()
    .on('files-added', (files) => {
      setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

  return (
    <Layout title={`가게 공지사항 수정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 공지사항 수정'
      />
      <Section
        title='가게 공지사항 정보'
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='title'
            value={storeNotice.title}
            error={storeNoticeError.title}
            fullWidth
            label='제목'
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
            label='내용'
            multiline
            onChange={(event) => {
              setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, content: event.target.value }));
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
            const response = await putStoreNotice(session, storeNotice);
            if (response.status === 200) {
              router.push(`/store-notices/${response.data.id}/`);
              toast.success('가게 공지사항이 업데이트 되었습니다.');
            } else if (response.status === 400) {
              if (response.data.title) {
                setStoreNoticeError(prevStoreNoticeError => ({...prevStoreNoticeError, title: true}));
              } else {
                setStoreNoticeError(prevStoreNoticeError => ({...prevStoreNoticeError, title: false}));
              }
              if (response.data.content) {
                setStoreNoticeError(prevStoreNoticeError => ({...prevStoreNoticeError, content: true}));
              } else {
                setStoreNoticeError(prevStoreNoticeError => ({...prevStoreNoticeError, content: false}));
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
              pathname: '/store-notices/delete/',
              query: { id: storeNotice.id },
            })}
          >
            가게 공지사항 삭제
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Update;
