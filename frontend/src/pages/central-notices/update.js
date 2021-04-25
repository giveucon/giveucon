import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import Uppy from '@uppy/core'
import { Dashboard, useUppy } from '@uppy/react'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import convertJsonToFormData from '../../utils/convertJsonToFormData'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

function Update({ selfUser }) {

  const router = useRouter();
  const classes = useStyles();
  const [centralNotice, setCentralNotice] = useState(null);
  const [centralNoticeError, setCentralNoticeError] = useState({
    title: false,
    content: false,
  });
  
  const getCentralNotice = async () => {
    return await requestToBackend(`api/central-notices/${router.query.id}/`, 'get', 'json', null, null);
  };

  const putCentralNotice = async (centralNotice) => {
    const processedCentralNotice = {
      article: {
        title: centralNotice.title,
        content: centralNotice.content,
        images: centralNotice.images,
      },
    };
    return await requestToBackend(`api/central-notices/${centralNotice.id}/`, 'put', 'multipart', convertJsonToFormData(processedCentralNotice), null);
  };

  const uppy = useUppy(() => {
    return new Uppy()
    .on('files-added', (files) => {
      setCentralNotice(prevCentralNotice => ({ ...prevCentralNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setCentralNotice(prevCentralNotice => ({ ...prevCentralNotice, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

  useEffect(() => {
    const fetch = async () => {
      const centralNoticeResponse = await getCentralNotice();
      setCentralNotice(centralNoticeResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

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
            const response = await putCentralNotice(centralNotice);
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

export default withAuth(Update);
