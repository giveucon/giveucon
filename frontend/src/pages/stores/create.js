import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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
import withAuth from '../../utils/withAuth'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const postStore = async (store) => {
  return await requestToBackend('api/stores/', 'post', 'multipart', convertJsonToFormData(store), null);
};

function Create({ selfUser }) {
  const router = useRouter();
  const [store, setStore] = useState({
    name: null,
    description: null,
    images: [],
    tags: [],
  });
  const [storeError, setStoreError] = useState({
    name: false,
    description: false,
  });
  const [tagList, setTagList] = useState(null);

  const uppy = useUppy(() => {
    return new Uppy()
    .on('file-added', (file) => {
      setStore(prevStore => ({ ...prevStore, images: uppy.getFiles().map((file) => file.data) }));
    })
    .on('file-removed', (file, reason) => {
      setStore(prevStore => ({ ...prevStore, images: uppy.getFiles().map((file) => file.data) }));
    })
  })

  useEffect(() => {
    const fetch = async () => {
      const tagListResponse = await requestToBackend('api/tags/', 'get', 'json', null, null);
      setTagList(tagListResponse.data);
    }
    fetch();
  }, []);
  if (!tagList) return <div>loading...</div>
  
  return (
    <Layout title={`가게 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 생성'
      />
      <Section
        title='기본 정보'
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={store.name}
            error={storeError.name}
            fullWidth
            label='가게 이름'
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
            label='가게 설명'
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
            options={tagList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setStore(prevStore => ({ ...prevStore, tags: value.map(value => value.id) }));
            }}
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </React.Fragment>
            )}
            style={{ minWidth: '2rem' }}
            renderInput={(params) => (
              <TextField {...params} label='태그' placeholder='태그' />
            )}
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
            const response = await postStore(store);
            if (response.status === 201) {
              router.push(`/stores/${response.data.id}/`);
              toast.success('가게가 생성되었습니다.');
            } 
            else if (response.status === 400) {
              if (response.data.name) {
                setStoreError(prevStoreError => ({...prevStoreError, name: true}));
              } else {
                setStoreError(prevStoreError => ({...prevStoreError, name: false}));
              }
              if (response.data.description) {
                setStoreError(prevStoreError => ({...prevStoreError, description: true}));
              } else {
                setStoreError(prevStoreError => ({...prevStoreError, description: false}));
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
