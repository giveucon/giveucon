import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ChatIcon from '@material-ui/icons/Chat';
import SettingsIcon from '@material-ui/icons/Settings';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import ListItem from 'components/ListItem';
import Section from 'components/Section';
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getCentralNoticeList = async (context) => await requestToBackend(context, 'api/central-notices/', 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const centralNoticeListResponse = await getCentralNoticeList(context);
  return {
    props: { lng, lngDict, selfUser, centralNoticeList: centralNoticeListResponse.data.results }
  }
})

function Index({ lng, lngDict, selfUser, centralNoticeList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('notices')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('notices')}
      />
      <Section
        titlePrefix={<IconButton><AnnouncementIcon /></IconButton>}
        title={i18n.t('newNotices')}
        padding={false}
      >
        {(centralNoticeList.length > 0) ? (
          <SwipeableTileList autoplay>
            {centralNoticeList.slice(0, constants.TILE_LIST_SLICE_NUMBER).map((item, index) => <Tile
                key={item.id}
                title={item.article.title}
                image={
                  item.article.images && (item.article.images.length > 0)
                  ? item.article.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/central-notices/${item.id}`)}
              />)}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('allNotices')}
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
        titleSuffix={
          <IconButton onClick={() => router.push('/central-notices/list/')}>
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {(centralNoticeList.length > 0) ? (
          centralNoticeList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
            <>
              <ListItem
                variant='notice'
                title={item.article.title}
                date={item.article.created_at}
                onClick={() => router.push(`/central-notices/${item.id}/`)}
              />
              {index < centralNoticeList.slice(0, constants.LIST_SLICE_NUMBER).length - 1 && (<Divider />)}
            </>
          ))
          ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      {true && (
        <Section
          title={i18n.t('managements')}
          titlePrefix={<IconButton><SettingsIcon /></IconButton>}
        >
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={() => router.push(`/central-notices/create/`)}
            >
              {i18n.t('addNotice')}
            </Button>
          </Box>
        </Section>
      )}
    </Layout>
  );
}

export default Index;
