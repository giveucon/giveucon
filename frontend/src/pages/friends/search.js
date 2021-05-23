import React, { useState } from 'react';
import gravatar from 'gravatar';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import Section from 'components/Section';
import ListItem from 'components/ListItem';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: {
      lng,
      lngDict,
      selfUser
    }
  }))

function Search({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [keywords, setKeywords] = useState({
    user_name: null,
    email: null
  });
  const [userList, setUserList] = useState([]);
  const [userListpage, setUserListpage] = useState(1);
  const [hasMoreUserList, setHasMoreUserList] = useState(true);

  const getUserList = async () => {
    const params = {
      user: keywords.user_name || null,
      email: keywords.email || null
    };
    const getUserListResponse = await requestToBackend(null, 'api/users/', 'get', 'json', null, params);
    if (getUserListResponse.status === 200) {
      setUserList(prevUserList => getUserListResponse.data.results);
      setUserListpage(prevUserListpage => 1);
      if (getUserListResponse.data.next === null) setHasMoreUserList(prevHasMoreUserList => false);
    }
    else toast.error(i18n.t('_errorOccurredProcessingRequest'));
  };

  const getMoreUserList = async () => {
    const params = {
      user: keywords.user_name || null,
      email: keywords.email || null,
      page: userListpage + 1,
    };
    const getUserListResponse = await requestToBackend(null, 'api/users/', 'get', 'json', null, params);
    if (getUserListResponse.status === 200) {
      setUserList(prevUserList => prevUserList.concat(getUserListResponse.data.results));
      setUserListpage(prevUserListpage => prevUserListpage + 1);
      if (getUserListResponse.data.next === null) setHasMoreUserList(prevHasMoreUserList => false);
    }
    else toast.error(i18n.t('_errorOccurredProcessingRequest'));
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
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
        {userList.length > 0 ? (
          <InfiniteScroll
            dataLength={userList.length}
            next={getMoreUserList}
            hasMore={hasMoreUserList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
          {userList.map((item, index) => (
            <>
              <ListItem
                key={item.id}
                variant='user'
                title={item.user_name}
                image={gravatar.url(item.email, {default: 'identicon'})}
                onClick={() => router.push(`/users/${item.id}/` )}
              />
              {index < userList.length - 1 && (<Divider />)}
            </>
          ))}
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Search;
