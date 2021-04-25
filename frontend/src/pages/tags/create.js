import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Create({ selfUser }) {

  const router = useRouter();
  const [tag, setTag] = useState({
    name: null,
  });
  const [tagError, setTagError] = useState({
    name: false,
  });

  const postTag = async (tag) => {
    const data = {
      name: tag.name,
    }
    return await requestToBackend('api/tags/', 'post', 'json', data, null);
  };

  return (
    <Layout title={`태그 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='태그 생성'
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={tag.name}
            error={tagError.name}
            fullWidth
            label='태그 이름'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setTag(prevTag => ({ ...prevTag, name: event.target.value }));
            }}
            required
          />
        </Box>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await postTag(tag);
            if (response.status === 201) {
              // router.push(`/tags/${response.id}/`);
              toast.success('태그가 생성되었습니다.');
            } 
            else if (response.status === 400) {
              if (response.data.name) {
                setTagError(prevTagError => ({...prevTagError, name: true}));
              } else {
                setTagError(prevTagError => ({...prevTagError, name: false}));
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

export default withAuth(Create);
