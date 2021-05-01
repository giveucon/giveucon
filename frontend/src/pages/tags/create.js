import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const postTag = async (tag) => {
  const data = {
    name: tag.name,
  }
  return await requestToBackend(null, 'api/tags/', 'post', 'json', data, null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  if (!selfUser.staff){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser },
  };
})

function Create({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [tag, setTag] = useState({
    name: null,
  });
  const [tagError, setTagError] = useState({
    name: false,
  });

  return (
    <Layout
      locale={lng}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('addTag')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('addTag')}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={tag.name}
            error={tagError.name}
            fullWidth
            label={i18n.t('name')}
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
              toast.success(i18n.t('_tagSuccessfullyAdded'));
            } 
            else if (response.status === 400) {
              if (response.data.name) {
                setTagError(prevTagError => ({...prevTagError, name: true}));
              } else {
                setTagError(prevTagError => ({...prevTagError, name: false}));
              }
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
