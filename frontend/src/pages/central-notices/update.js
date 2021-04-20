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
import jsonToFormData from '../functions/jsonToFormData'
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

const getCentralNotice = async (session, context) => {
  return await requestToBackend(session, `api/central-notices/${context.query.id}/`, 'get', 'json');
};

const putCentralNotice = async (session, centralNotice) => {
  const processedCentralNotice = {
    article: {
      title: centralNotice.title,
      content: centralNotice.content,
      images: centralNotice.images,
    },
  };
  return await requestToBackend(session, 'api/central-notices/', 'put', 'multipart', jsonToFormData(processedCentralNotice), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  if (!selfUser.staff) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  const prevCentralNoticeResponse = await getCentralNotice(session, context);
  return {
    props: { session, selfUser, prevCentralNotice: prevCentralNoticeResponse.data },
  };
})

function Update({ session, selfUser, prevCentralNotice }) {
  const router = useRouter();
  const classes = useStyles();
  const [centralNotice, setCentralNotice] = useState({
    id: prevCentralNotice.id,
    title: prevCentralNotice.title,
    content: prevCentralNotice.content,
    images: prevCentralNotice.images,
  });
  const [centralNoticeError, setCentralNoticeError] = useState({
    title: false,
    content: false,
  });
  
  const uppy = useUppy(() => {
    return new Uppy()
    .on('files-added', (files) => {
      setCentralNotice(prevCentralNotice => ({ ...prevCentralNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setCentralNotice(prevCentralNotice => ({ ...prevCentralNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

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
            const response = await putCentralNotice(session, centralNotice);
            if (response.status === 200) {
              router.push(`/central-notices/${response.data.id}/`);
              toast.success('공지사항이 업데이트 되었습니다.');
            } else if (response.status === 400) {
              if (response.data.title) {
                setCentralNoticeError(prevCentralNoticeError => ({...prevCentralNoticeError, title: true}));
              } else {
                setCentralNoticeError(prevCentralNoticeError => ({...prevCentralNoticeError, title: false}));
              }
              if (response.data.content) {
                setCentralNoticeError(prevCentralNoticeError => ({...prevCentralNoticeError, content: true}));
              } else {
                setCentralNoticeError(prevCentralNoticeError => ({...prevCentralNoticeError, content: false}));
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
