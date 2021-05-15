import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import KakaoMapBox from 'components/KakaoMapBox';
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
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

const putSelfUser = async (selfUser) => {
  console.log(data);
  const data = {
    ...selfUser,
    // menu_items: selfUser.menu_items
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser }
  }
})

function Location({ lng, lngDict, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [selfUser, setSelfUser] = useState({
    ...prevSelfUser,
    // menu_items: prevSelfUser.menu_items,
  });
  const [selfUserError, setSelfUserError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
    phone_number: false,
  });
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
  })
  const [address, setAddress] = useState('')

  return (
    <Layout
      locale={lng}
      menuItemList={prevSelfUser.menu_items}
      title={`${i18n.t('location')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('location')}
      />
      <Section
        title={i18n.t('location')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
        titleSuffix={
          <Switch
            checked={selfUser.dark_mode}
            color='primary'
          /*
            onChange={async () => {
              const response = await toggleSelfUserDarkMode(selfUser);
              if (response.status === 200) router.reload();
              else toast.error(i18n.t('_checkInputFields'));
            }}
          */
          />
        }
      >
        <Card>
          <KakaoMapBox
            findCurrentLocation
            setPosition={setPosition}
            setAddress={setAddress}
          />
        </Card>
        <Box>
          <Typography>{position.latitude}, {position.longitude}</Typography>
          <Typography>{address}</Typography>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {
              const getPosition = async () => {
                await navigator.geolocation.getCurrentPosition(newPosition => {
                  setPosition(prevPosition => ({
                    ...prevPosition, 
                    latitude: newPosition.coords.latitude, 
                    longitude: newPosition.coords.longitude
                  }))
                });
              }
              getPosition();
            }}
          >
            {i18n.t('findCurrentLocation')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Location;
