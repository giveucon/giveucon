import React, { useState } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import StoreIcon from '@material-ui/icons/Store';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import UserProfileSection from 'components/UserProfileSection';
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
  favoriteButton: {
    color: theme.palette.favorite.main,
    '&:hover': {
      color: theme.palette.favorite.dark,
    },
  },
}));

const getUser = async (context) => await requestToBackend(context, `api/users/${context.query.id}/`, 'get', 'json');

const getStoreList = async (context, user) => await requestToBackend(context, `api/stores/`, 'get', 'json', null, {
  user: user.id
});

const getFavoriteProductList = async (context, user) => await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, {
  user: user.id
});

const getFriend = async (context, selfUser) => await requestToBackend(context, 'api/friends/', 'get', 'json', null, {
  from_user: selfUser.id,
  to_user: context.query.id
});

const postFriend = async (user) => await requestToBackend(null, 'api/friends/', 'post', 'json', {
  to_user: user.id
}, null);

const deleteFriend = async (friend) => await requestToBackend(null, `api/friends/${friend.id}/`, 'delete', 'json');

const getSelfFavoriteStore = async (context, selfUser, store) => await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, {
  user: selfUser.id,
  store: store.id
});

const postSelfFavoriteStore = async (store) => await requestToBackend(null, 'api/favorite-stores/', 'post', 'json', {
  store: store.id
}, null);

const deleteSelfFavoriteStore = async (favoriteStore) => await requestToBackend(null, `api/favorite-stores/${favoriteStore.id}/`, 'delete', 'json');

const getSelfFavoriteProduct = async (context, selfUser, favoriteProduct) => await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, {
  user: selfUser.id,
  product: favoriteProduct.product.id
});

const postSelfFavoriteProduct = async (product) => await requestToBackend(null, 'api/favorite-products/', 'post', 'json', {
  product: product.id
}, null);

const deleteSelfFavoriteProduct = async (favoriteProduct) => await requestToBackend(null, `api/favorite-products/${favoriteProduct.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const userResponse = await getUser(context);
  if (userResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeListResponse = await getStoreList(context, userResponse.data);
  for (const store of storeListResponse.data.results) {
    const selfFavoriteStoreResponse = await getSelfFavoriteStore(context, selfUser, store);
    store.favorite = (selfFavoriteStoreResponse.data.count === 1) ? selfFavoriteStoreResponse.data.results[0] : null
  }
  const favoriteProductListResponse = await getFavoriteProductList(context, userResponse.data);
  for (const favoriteProduct of favoriteProductListResponse.data.results) {
    const selfFavoriteProductResponse = await getSelfFavoriteProduct(context, selfUser, favoriteProduct);
    favoriteProduct.favorite = (selfFavoriteProductResponse.data.count === 1) ? selfFavoriteProductResponse.data.results[0] : null
  }
  const friendResponse = await getFriend(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      user: userResponse.data,
      storeList: storeListResponse.data.results,
      favoriteProductList: favoriteProductListResponse.data.results,
      friend: (friendResponse.data.results.length === 1) ? friendResponse.data.results[0] : null
    }
  }
})

function Id({ lng, lngDict, selfUser, user, storeList: _storeList, favoriteProductList: _favoriteProductList, friend: _friend }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [storeList, setStoreList] = useState(_storeList);
  const [favoriteProductList, setFavoriteProductList] = useState(_favoriteProductList);
  const [friend, setFriend] = useState(_friend)

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${user.user_name} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={user.user_name}
      />
      <UserProfileSection
        name={user.user_name}
        subtitle={user.email}
        image={gravatar.url(user.email, {default: 'identicon'})}
      >
        {!friend && (
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={async () => {
                const postFriendResult = await postFriend(user);
                if (postFriendResult.status === 201) setFriend(postFriendResult.data);
                else toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }}
            >
              {i18n.t('addFriend')}
            </Button>
          </Box>
        )}
        {friend && (
          <Box marginY={1}>
            <Button
              className={classes.errorButton}
              fullWidth
              variant='contained'
              onClick={async () => {
                const deleteFriendResult = await deleteFriend(friend);
                if (deleteFriendResult.status === 204) setFriend(null);
                else toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }}
            >
              {i18n.t('deleteFriend')}
            </Button>
          </Box>
        )}
      </UserProfileSection>


      <Section
        title={i18n.t('ownedStores')}
        titlePrefix={<IconButton><StoreIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: user.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
        padding={false}
      >
        {storeList.length > 0 ? (
          <Grid container>
            {storeList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Grid item xs={6} key={item.id}>
                <Tile
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/stores/${item.id}/` )}
                  actions={[
                    <IconButton className={item.favorite ? classes.favoriteButton : null}>
                      <FavoriteIcon
                        onClick={async () => {
                          if (!item.favorite) {
                            const postFavoriteStoreResult = await postSelfFavoriteStore(item);
                            if (postFavoriteStoreResult.status === 201) {
                              setStoreList(storeList.map(store =>
                                store.id === item.id
                                ? {...store, favorite: postFavoriteStoreResult.data}
                                : store
                              ));
                            }
                            else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                          } else {
                            const deleteFavoriteStoreResult = await deleteSelfFavoriteStore(item.favorite);
                            if (deleteFavoriteStoreResult.status === 204) {
                              setStoreList(storeList.map(store =>
                                store.id === item.id
                                ? {...store, favorite: null}
                                : store
                              ));
                            }
                            else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                          }
                        }}
                      />
                    </IconButton>
                  ]}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('favoriteProducts')}
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/favorite-products/list/',
              query: { user: user.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
        padding={false}
      >
        {favoriteProductList.length > 0 ? (
          <Grid container>
            {favoriteProductList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Grid item xs={6} key={item.id}>
                <Tile
                  title={item.product.name}
                  image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/products/${item.product.id}/` )}
                  actions={[
                    <IconButton className={item.favorite ? classes.favoriteButton : null}>
                      <FavoriteIcon
                        onClick={async () => {
                          if (!item.favorite) {
                            const postFavoriteStoreResult = await postSelfFavoriteProduct(item.product);
                            if (postFavoriteStoreResult.status === 201) {
                              setFavoriteProductList(favoriteProductList.map(favoriteProduct =>
                                favoriteProduct.id === item.id
                                ? {...favoriteProduct, favorite: postFavoriteStoreResult.data}
                                : favoriteProduct
                              ));
                            }
                            else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                          } else {
                            const deleteFavoriteStoreResult = await deleteSelfFavoriteProduct(item.favorite);
                            if (deleteFavoriteStoreResult.status === 204) {
                              setFavoriteProductList(favoriteProductList.map(favoriteProduct =>
                                favoriteProduct.id === item.id
                                ? {...favoriteProduct, favorite: null}
                                : favoriteProduct
                              ));
                            }
                            else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                          }
                        }}
                      />
                    </IconButton>
                  ]}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      {selfUser.id === user.id && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/my-account/')}
          >
            {i18n.t('goToMyAccount')}
          </Button>
        </Box>
      )}
    </Layout>
  );

}

export default Id;
