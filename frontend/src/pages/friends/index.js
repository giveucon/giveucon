import React from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ContactsIcon from '@material-ui/icons/Contacts';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import ListItem from 'components/ListItem';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getSelfFriendList = async (context, selfUser) => {
  const params = {
    from_user: selfUser.id,
  }
  return await requestToBackend(context, 'api/friends/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const selfFriendListResponse = await getSelfFriendList(context, selfUser);
  if (selfFriendListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfFriendList: selfFriendListResponse.data.results
    }
  }
})

function Index({ lng, lngDict, selfUser, selfFriendList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('friends')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('friends')}
      >
      </Section>


      <Section
        title={i18n.t('myFriends')}
        titlePrefix={<IconButton><ContactsIcon /></IconButton>}
        titleSuffix={
          <IconButton 
            onClick={() => router.push({
              pathname: '/friends/list/',
              query: { from_user: selfUser.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {selfFriendList.length > 0 ? (
          selfFriendList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
            <>
              <ListItem
                key={index}
                variant='user'
                name={item.to_user.user_name}
                onClick={() => router.push(`/users/${item.to_user.id}/` )}
                image={gravatar.url(item.to_user.email, {default: 'identicon'})}
              />
              {index < selfFriendList.length - 1 && (<Divider />)}
            </>
          ))
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>

      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.push('/friends/search/')}
        >
          {i18n.t('searchFriends')}
        </Button>
      </Box>

    </Layout>
  );
}

export default Index;
