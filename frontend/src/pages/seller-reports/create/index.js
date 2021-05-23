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
import ReportIcon from '@material-ui/icons/Report';

import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList'
import Tile from 'components/Tile'
import useI18n from 'hooks/useI18n'
import convertJsonToFormData from 'utils/convertJsonToFormData'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getSeller = async (context) => await requestToBackend(context, `api/users/${context.query.seller}/`, 'get', 'json');

const postSellerReport = async (sellerReport, imageList) => {
  const processedSellerReport = {
    article: {
      title: sellerReport.title,
      content: sellerReport.content,
      images: imageList.map(image => image.file),
    },
    seller: sellerReport.seller,
  };
  return await requestToBackend(null, 'api/seller-reports/', 'post', 'multipart', convertJsonToFormData(processedSellerReport), null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const sellerResponse = await getSeller(context);
  if (sellerResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, seller: sellerResponse.data }
  }
})

function Index({ lng, lngDict, selfUser, seller }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [sellerReport, setSellerReport] = useState({
    category: null,
    title: null,
    content: null,
    seller: seller.id
  });
  const [sellerReportError, setSellerReportError] = useState({
    title: false,
    content: false,
  });
  const [imageList, setImageList] = useState([]);

  const dummyCategoryList = [
    {
      id: 1,
      name: 'Hi'
    },{
      id: 2,
      name: 'Hello'
    }
  ]

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('reportSeller')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('reportSeller')}
      />
      <Section
        title={i18n.t('reportForm')}
        titlePrefix={<IconButton><ReportIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <Autocomplete
            // multiple
            options={dummyCategoryList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setSellerReport(prevSellerReport => ({...prevSellerReport, category: value}));
            }}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                  checkedIcon={<CheckBoxIcon fontSize='small' />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </>
            )}
            style={{ minWidth: '2rem' }}
            renderInput={(params) => (
              <TextField {...params} label={i18n.t('categories')} placeholder={i18n.t('categories')} />
            )}
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='title'
            value={sellerReport.title}
            error={sellerReportError.title}
            fullWidth
            label={i18n.t('title')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSellerReport(prevSellerReport => ({ ...prevSellerReport, title: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='content'
            value={sellerReport.content}
            error={sellerReportError.content}
            fullWidth
            label={i18n.t('content')}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSellerReport(prevSellerReport => ({ ...prevSellerReport, content: event.target.value }));
            }}
            required
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
                      key={item.id}
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
                      className={classes.errorButton}
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
          className={classes.errorButton}
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await postSellerReport(sellerReport, imageList);
            if (response.status === 201) {
              router.push('/seller-reports/create/completed/');
              toast.success(i18n.t('_sellerSuccessfullyReported'));
            }
            else if (response.status === 400) {
              setSellerReportError(prevSellerReportError => ({...prevSellerReportError, title: !!response.data.title}));
              setSellerReportError(prevSellerReportError => ({...prevSellerReportError, content: !!response.data.content}));
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

export default Index;
