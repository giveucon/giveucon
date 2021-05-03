import React from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CodeIcon from '@material-ui/icons/Code';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

import Layout from 'components/Layout'
import Section from 'components/Section'
import UserProfileBox from 'components/UserProfileBox'
import useI18n from 'hooks/useI18n'
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

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser },
  };
})

function Index({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('myAccount')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('myAccount')}
      >
      </Section>
      <Section
        title={i18n.t('myInfo')}
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <UserProfileBox
          name={selfUser.user_name}
          subtitle={selfUser.email}
          image={gravatar.url(selfUser.email, {default: 'identicon'})}
          onClick={() => router.push(`/users/${selfUser.id}/`)}
        />
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: selfUser.id },
            })}
          >
            {i18n.t('myStores')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/list/',
              query: { user: selfUser.id },
            })}
          >
            {i18n.t('myProducts')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupons/list/',
              query: { user: selfUser.id },
            })}
          >
            {i18n.t('myCoupons')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push('/coupons/scan/')}
          >
            {i18n.t('scanCoupon')}
          </Button>
        </Box>
      </Section>
      <Section
        title={i18n.t('favorites')}
        titlePrefix={<IconButton><FavoriteIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/friends/list/',
              query: { user: selfUser.id },
            })}
          >
            {i18n.t('friends')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/favorite-stores/list/',
              query: { user: selfUser.id },
            })}
          >
            {i18n.t('favoriteStores')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/favorite-products/list/',
              query: { user: selfUser.id },
            })}
          >
            {i18n.t('favoriteProducts')}
          </Button>
        </Box>
      </Section>
      <Section
        title={i18n.t('managements')}
        titlePrefix={<IconButton><SettingsIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/central-notices/')}
          >
            {i18n.t('notices')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/myaccount/update/')}
          >
            {i18n.t('settings')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/about/')}
          >
            {i18n.t('about')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={() => {router.push('/oauth/kakao/logout/')}}
          >
            {i18n.t('logout')}
          </Button>
        </Box>
      </Section>
      <Section
        title={i18n.t('developerTools')}
        titlePrefix={<IconButton><CodeIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/database/create/')}
          >
            {i18n.t('createDatabase')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {router.push('/sandbox/components/')}}
          >
            {i18n.t('components')}
          </Button>
        </Box>

        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/sandbox/scanner/')}
          >
            QR코드 스캐너
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {
              toast.success('Hello World');
            }}
          >
            React-Hot-Toast 테스트
          </Button>
        </Box>

      </Section>
    </Layout>
  );
}

export default Index;
