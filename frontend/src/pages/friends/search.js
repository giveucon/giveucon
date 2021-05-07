import React, { useState } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import UserListItem from 'components/UserListItem';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getUserList = async (keywords) => {
  const params = {
    user_name: keywords.user_name || null,
    email: keywords.email || null
  }
  return await requestToBackend(null, 'api/users/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: {
      lng,
      lngDict,
      selfUser
    }
  }
})

function Search({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [keywords, setKeywords] = useState({
    user_name: null,
    email: null
  });
  const [searchResultList, setSearchResultList] = useState([]);

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('searchFriends')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('searchFriends')}
      />


      <Section
        title={i18n.t('keywords')}
        titlePrefix={<IconButton><VpnKeyIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='user_name'
            value={keywords.user_name}
            fullWidth
            label={i18n.t('username')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setKeywords(prevKeywords => ({ ...prevKeywords, user_name: event.target.value }));
            }}
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='email'
            value={keywords.email}
            fullWidth
            label={i18n.t('email')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setKeywords(prevKeywords => ({ ...prevKeywords, email: event.target.value }));
            }}
          />
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const getUserListResult = await getUserList(keywords);
              console.log(getUserListResult);
              if (getUserListResult.status === 200) setSearchResultList(getUserListResult.data.results);
              else toast.error(i18n.t('_errorOccurredProcessingRequest'));
            }}
          >
            {i18n.t('searchUser')}
          </Button>
        </Box>
      </Section>

      <Section
        title={i18n.t('searchResults')}
        titlePrefix={<IconButton><SearchIcon /></IconButton>}
      >
        {searchResultList.length > 0 ? (
          searchResultList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
            <>
              <UserListItem
                key={index}
                name={item.user_name}
                image={gravatar.url(item.email, {default: 'identicon'})}
                onClick={() => router.push(`/users/${item.id}/` )}
              />
              {index < searchResultList.length - 1 && (<Divider />)}
            </>
          ))
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>

    </Layout>
  );
}

export default Search;
