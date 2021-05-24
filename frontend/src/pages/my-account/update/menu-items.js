import React, { useState } from 'react';
import { useRouter } from 'next/router';
import arrayMove from 'array-move';
import toast from 'react-hot-toast';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import Layout from 'components/Layout';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';
import * as constants from '../../../constants';

const putSelfUser = async (selfUser) => {
  const data = {
    email: selfUser.email,
    user_name: selfUser.user_name,
    first_name: selfUser.first_name,
    last_name: selfUser.last_name,
    locale: selfUser.locale,
    dark_mode: selfUser.dark_mode,
    menu_items: selfUser.menu_items,
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: { lng, lngDict, selfUser }
  }))

function MenuItems({ lng, lngDict, selfUser }) {
  const i18n = useI18n();
  const router = useRouter();
  const [unusedMenuItemList, setUnusedMenuItemKeyList] = useState(['scan', 'goBack']);
  const [menuItemList, setMenuItemKeyList] = useState(['home', 'myWallet', 'stores', 'trades', 'myAccount']);

  function not(lhs, rhs) {
    return lhs.filter((value) => rhs.indexOf(value) === -1);
  }

  const DragHandle = sortableHandle(() => <DragHandleIcon />);
  const SortableMenuItemContainer = SortableContainer(({children}) => <List>{children}</List>);

  const SortableUnusedMenuItem = SortableElement(({value}) => (
    <ListItem>
      <ListItemAvatar>
        <Box display='flex' alighItems='center'>
          <DragHandle />
          <Box marginX={1}>{constants.MENU_ITEM_LIST.find(item => item.value === value).icon}</Box>
        </Box>
      </ListItemAvatar>
      <ListItemText primary={i18n.t(constants.MENU_ITEM_LIST.find(item => item.value === value).label)} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>{
            if (menuItemList.length >= 5) {
              toast.error(i18n.t('_maxMenuItemNumberReached'));
            } else {
              setUnusedMenuItemKeyList(unusedMenuItemList => not(unusedMenuItemList, value));
              setMenuItemKeyList(menuItemList => menuItemList.concat(value));
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ));
  const onSortUnusedMenuItemEnd = ({oldIndex, newIndex}) => {
    setUnusedMenuItemKeyList(unusedMenuItemList => arrayMove(unusedMenuItemList, oldIndex, newIndex));
  };

  const SortableMenuItem = SortableElement(({value}) => (
    <ListItem>
      <ListItemAvatar>
        <Box display='flex' alighItems='center'>
          <DragHandle />
          <Box marginX={1}>{constants.MENU_ITEM_LIST.find(item => item.value === value).icon}</Box>
        </Box>
      </ListItemAvatar>
      <ListItemText primary={i18n.t(constants.MENU_ITEM_LIST.find(item => item.value === value).label)} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>{
            setMenuItemKeyList(menuItemList => not(menuItemList, value));
            setUnusedMenuItemKeyList(UnusedMenuItemKeyList => UnusedMenuItemKeyList.concat(value));
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ));
  const onSortMenuItemEnd = ({oldIndex, newIndex}) => {
    setMenuItemKeyList(menuItemList => arrayMove(menuItemList, oldIndex, newIndex));
  };

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('menuItems')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('menuItems')}
       />
      <Section
        title={i18n.t('unusedMenuItems')}
        titlePrefix={<IconButton><CheckBoxOutlineBlankIcon /></IconButton>}
      >
        <SortableMenuItemContainer onSortEnd={onSortUnusedMenuItemEnd} useDragHandle>
          {unusedMenuItemList.map((item, index) => (
            <SortableUnusedMenuItem key={item} index={index} value={item} />
          ))}
        </SortableMenuItemContainer>
      </Section>
      <Section
        title={i18n.t('usedMenuItems')}
        titlePrefix={<IconButton><CheckBoxIcon /></IconButton>}
      >
        <SortableMenuItemContainer onSortEnd={onSortMenuItemEnd} useDragHandle>
          {menuItemList.map((item, index) => (
            <SortableMenuItem key={item} index={index} value={item} />
          ))}
        </SortableMenuItemContainer>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await putSelfUser(selfUser);
            if (response.status === 200) {
              router.push('/my-account/update/');
              toast.success(i18n.t('_myAccountSuccessfullyEdited'));
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
    </Layout>
  );
}

export default MenuItems;
