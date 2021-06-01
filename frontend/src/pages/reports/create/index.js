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

const getSeller = async (context) => await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');

const postReport = async (report, imageList) => {
  const processedReport = {
    article: {
      title: report.title,
      content: report.content,
      images: imageList.map(image => image.file),
    },
    to_user: report.user,
  };
  return await requestToBackend(null, 'api/reports/', 'post', 'multipart', convertJsonToFormData(processedReport), null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const userResponse = await getSeller(context);
  if (userResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, user: userResponse.data }
  }
})

function Index({ lng, lngDict, selfUser, user }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [report, setReport] = useState({
    title: null,
    content: null,
    user: user.id
  });
  const [reportError, setReportError] = useState({
    title: false,
    content: false,
  });
  const [imageList, setImageList] = useState([]);

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
          <TextField
            name='title'
            value={report.title}
            error={reportError.title}
            fullWidth
            label={i18n.t('title')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setReport(prevReport => ({ ...prevReport, title: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='content'
            value={report.content}
            error={reportError.content}
            fullWidth
            label={i18n.t('content')}
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setReport(prevReport => ({ ...prevReport, content: event.target.value }));
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
          {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove }) => (
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
            const postReportResponse = await postReport(report, imageList);
            if (postReportResponse.status === 201) {
              router.push('/reports/create/completed/');
              toast.success(i18n.t('_sellerReported'));
            }
            else if (postReportResponse.status === 400) {
              setReportError(prevReportError => ({...prevReportError, title: !!postReportResponse.data.title}));
              setReportError(prevReportError => ({...prevReportError, content: !!postReportResponse.data.content}));
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
