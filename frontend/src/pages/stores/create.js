import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import jsonToFormData from '../jsonToFormData'
import withAuthServerSideProps from '../withAuthServerSideProps'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const getTagList = async (session) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/tags/`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const postStore = async (session, store) => {
  try {
    console.log(store);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/`, store, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const tagListResponse = await getTagList(session)
  return {
    props: { session, selfUser, tagList: tagListResponse.data },
  }
})

function Create({ session, selfUser, tagList }) {
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
  return (
    <Layout title={`가게 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 생성'
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={store.name}
            error={storeError.name}
            fullWidth
            label='가게 이름'
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
            onChange={(event) => {
              setStore(prevStore => ({ ...prevStore, description: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <form
            className='uploader'
            encType='multipart/form-data'
          >
            <input
              type='file'
              name='photo'
              accept='image/*'
              multiple
              onChange={(event) => {
                setStore(prevStore => ({ ...prevStore, images: event.target.files }));
                console.log(event.target.files);
              }}
            />
          </form>
        </Box>
        <Box paddingY={1}>
          <Autocomplete
            multiple
            options={tagList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setStore(prevStore => ({ ...prevStore, tags: value.map(value => value.id) }));
              console.log(value.map(value => value.id));
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
        <Box display='flex' justifyContent='flex-end'>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await postStore(session, jsonToFormData(store));
              if (response.status === 201) {
                router.push(`/stores/${response.data.id}`);
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
              } else {
                toast.error('가게 생성 중 오류가 발생했습니다.');
              }
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Create;
