import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList';
import Tile from '../../components/Tile';
import convertImageToBase64 from '../../utils/convertImageToBase64'
import convertJsonToFormData from '../../utils/convertJsonToFormData'
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

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

const getTagList = async (context) => {
  return await requestToBackend(context, 'api/tags/', 'get', 'json');
};

const putStore = async (store, imageList) => {
  const processedStore = {
    ...store,
    images: imageList.map(image => image.file),
  }
  return await requestToBackend(null, `api/stores/${store.id}/`, 'put', 'multipart', convertJsonToFormData(processedStore), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const prevStoreResponse = await getStore(context);
  if (!selfUser.staff && (selfUser.id !== prevStoreResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  const tagListResponse = await getTagList(context);
  return {
    props: { selfUser, prevStore: prevStoreResponse.data, tagList: tagListResponse.data },
  };
})

function Update({ selfUser, prevStore, tagList }) {

  const router = useRouter();
  const classes = useStyles();
  const [store, setStore] = useState({
    id: prevStore.id,
    name: prevStore.name,
    description: prevStore.description,
    tags: prevStore.tags,
  });
  const [storeError, setStoreError] = useState({
    name: false,
    description: false,
  });
  const [imageList, setImageList] = useState(prevStore.images);

  useEffect(() => {
    let processedImageList = prevStore.images;
    const injectDataUrl = async () => {
      for (const image in processedImageList) {
        await convertImageToBase64(processedImageList[image].image, (dataURL) => {
          processedImageList[image].dataURL = dataURL;
        });
      }
      console.log(processedImageList);
      setImageList(processedImageList);
    }
    injectDataUrl();
  }, []);

  return (
    <Layout title={`가게 수정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 수정'
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
            options={tagList || dummyTagList}
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
              </>
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
            const response = await putStore(store, imageList);
            if (response.status === 200) {
              router.push(`/stores/${response.data.id}/`);
              toast.success('가게가 업데이트 되었습니다.');
            } else if (response.status === 400) {
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
              pathname: '/stores/delete/',
              query: { id: store.id },
            })}
          >
            가게 삭제
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Update;
