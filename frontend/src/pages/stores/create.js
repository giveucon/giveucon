import React, { useState } from 'react';
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
import ImageUploading from "react-images-uploading";

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import convertJsonToFormData from '../../utils/convertJsonToFormData'
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const getTagList = async (context) => {
  return await requestToBackend(context, 'api/tags/', 'get', 'json');
};

const postStore = async (store) => {
  const processedStore = {
    ...store,
    images: store.images.map(image => image.file),
  }
  return await requestToBackend(null, 'api/stores/', 'post', 'multipart', convertJsonToFormData(processedStore), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const tagListResponse = await getTagList(context);
  return {
    props: { selfUser, tagList: tagListResponse.data },
  }
})

function Create({ selfUser, tagList }) {

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

  const uppy = useUppy(() => {
    return new Uppy()
    .on('file-added', (file) => {
      setStore(prevStore => ({...prevStore, images: uppy.getFiles().map((file) => file.data)}));
    })
    .on('file-removed', (file, reason) => {
      setStore(prevStore => ({...prevStore, images: uppy.getFiles().map((file) => file.data)}));
    })
  })
  
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
              setStore(prevStore => ({...prevStore, name: event.target.value}));
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
              setStore(prevStore => ({...prevStore, description: event.target.value}));
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
              setStore(prevStore => ({...prevStore, tags: value.map(value => value.id)}));
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


          <ImageUploading
            multiple
            value={store.images}
            onChange={(images) => {
              console.log(store.images);
              setStore(prevStore => ({ ...prevStore, images }));
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
              // write your building UI
              <div className="upload__image-wrapper">
                <button
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here
                </button>
                &nbsp;
                <button onClick={onImageRemoveAll}>Remove all images</button>
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image["dataURL"]} alt="" width="100" />
                    <div className="image-item__btn-wrapper">
                      <button onClick={() => onImageUpdate(index)}>Update</button>
                      <button onClick={() => onImageRemove(index)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>


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

export default Create;
