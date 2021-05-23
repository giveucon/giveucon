import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import KakaoMapBox from 'components/KakaoMapBox';
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'
import * as constants from '../../../constants';

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const postSelfUserLocation = async (selfUser, location) => {
  const data = {
    id: selfUser.id,
    location
  };
  return await requestToBackend(null, '/api/user-locations/', 'post', 'json', data, null);
};

const putSelfUserLocation = async (location) => await requestToBackend(null, '/api/user-locations/self/', 'put', 'json', {location}, null);

const deleteSelfUserLocation = async () => await requestToBackend(null, '/api/user-locations/self/', 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: { lng, lngDict, selfUser }
  }))

function Location({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [location, setLocation] = useState({
    latitude: selfUser.location ? selfUser.location.latitude : constants.DEFAULT_LATITUDE,
    longitude: selfUser.location ? selfUser.location.longitude : constants.DEFAULT_LONGITUDE
  });
  const [address, setAddress] = useState('');

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('location')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('location')}
      />
      <Section
        title={i18n.t('location')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
      >
        {selfUser.location && (
        <>
          <Card>
            <KakaoMapBox
              location={location}
              setLocation={setLocation}
              setAddress={setAddress}
              enablePinMove
            />
          </Card>
          <Box paddingY='0.5rem'>
            <Typography>{address}</Typography>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => {
                new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject);
                }).then(
                  (location) => setLocation({
                    latitude: location.coords.latitude, longitude: location.coords.longitude
                  })
                );
              }}
            >
              {i18n.t('findCurrentLocation')}
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={async () => {
                const response = await putSelfUserLocation(location);
                if (response.status === 200) router.reload();
                else toast.error(i18n.t('_checkInputFields'));
              }}
            >
              {i18n.t('editLocation')}
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              className={classes.errorButton}
              fullWidth
              variant='contained'
              onClick={async () => {
                const response = await deleteSelfUserLocation();
                if (response.status === 204) router.reload();
                else toast.error(i18n.t('_checkInputFields'));
              }}
            >
              {i18n.t('deleteLocation')}
            </Button>
          </Box>
        </>
        )}
        {!selfUser.location && (
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={async () => {
                const response = await postSelfUserLocation(selfUser, location);
                if (response.status === 201) router.reload();
                else toast.error(i18n.t('_checkInputFields'));
              }}
            >
              {i18n.t('addLocation')}
            </Button>
          </Box>
        )}
      </Section>
    </Layout>
  );
}

export default Location;
