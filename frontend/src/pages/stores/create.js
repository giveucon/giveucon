import React, { useState } from 'react';
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

import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import convertJsonToFormData from 'utils/convertJsonToFormData'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

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

const getTagList = async (context) => {
  return await requestToBackend(context, 'api/tags/', 'get', 'json');
};

const postStore = async (store, imageList) => {
  const processedStore = {
    ...store,
    images: imageList.map(image => image.file),
  }
  return await requestToBackend(null, 'api/stores/', 'post', 'multipart', convertJsonToFormData(processedStore), null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const tagListResponse = await getTagList(context);
  return {
    props: { lng, lngDict, selfUser, tagList: tagListResponse.data },
  }
})

function Create({ lng, lngDict, selfUser, tagList }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [store, setStore] = useState({
    name: null,
    description: null,
    tags: [],
  });
  const [storeError, setStoreError] = useState({
    name: false,
    description: false,
  });
  const [imageList, setImageList] = useState([]);

  return (
    <Layout
      locale={selfUser.locale}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('addStore')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('addStore')}
      />
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={store.name}
            error={storeError.name}
            fullWidth
            label={i18n.t('name')}
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
            label={i18n.t('description')}
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
              <TextField {...params} label={i18n.t('tags')} placeholder={i18n.t('pages.stores.create.tags')} />
            )}
          />
        </Box>
      </Section>
      <Section
        title={i18n.t('images')}
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
                    {i18n.t('addImages')}
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
                      {i18n.t('deleteAllImages')}
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
            const response = await postStore(store, imageList);
            if (response.status === 201) {
              router.push(`/stores/${response.data.id}/`);
              toast.success(i18n.t('_storeSuccessfullyAdded'));
            } 
            else if (response.status === 400) {
              setStoreError(prevStoreError => ({...prevStoreError, name: !!response.data.name}));
              setStoreError(prevStoreError => ({...prevStoreError, description: !!response.data.description}));
              toast.error(i18n.t('_checkInputFields'));
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Create;
