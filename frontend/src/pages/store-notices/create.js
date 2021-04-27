import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

const postStoreNotice = async (storeNotice) => {
  const processedStoreNotice = {
    article: {
      title: storeNotice.title,
      content: storeNotice.content,
      images: storeNotice.images,
    },
    store: storeNotice.store,
  };
  return await requestToBackend(null, 'api/store-notices/', 'post', 'multipart', convertJsonToFormData(processedStoreNotice), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
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
    props: { selfUser, store: storeResponse.data },
  }
})

function Create({ selfUser, store }) {

  const router = useRouter();
  const [storeNotice, setStoreNotice] = useState({
    title: null,
    content: null,
    images: [],
    store: store.id
  });
  const [storeNoticeError, setStoreNoticeError] = useState({
    title: false,
    content: false,
  });

  const uppy = useUppy(() => {
    return new Uppy()
    .on('file-added', (file) => {
      setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setStoreNotice(prevStoreNotice => ({ ...prevStoreNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

  return (
    <Layout title={`가게 공지사항 추가 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 공지사항 추가'
      />
      <Section
        title='기본 정보'
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='title'
            value={storeNotice.title}
            error={storeNoticeError.title}
            fullWidth
            label='제목'
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
            label='내용'
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
            const response = await postStoreNotice(storeNotice);
            console.log(response.data);
            if (response.status === 201) {
              router.push(`/store-notices/${response.data.id}/`);
              toast.success('가게 공지사항이 생성되었습니다.');
            } 
            else if (response.status === 400) {
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
    </Layout>
  );
}

export default Create;
