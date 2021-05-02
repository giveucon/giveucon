import React, { useState } from 'react';
import { useRouter } from 'next/router'
import arrayMove from 'array-move';
import toast from 'react-hot-toast';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const putSelfUser = async (selfUser) => {
  const data = {
    email: selfUser.email,
    user_name: selfUser.user_name,
    first_name: selfUser.first_name,
    last_name: selfUser.last_name,
    locale: selfUser.locale,
    dark_mode: selfUser.dark_mode,
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const prevSelfUser = selfUser;
  return {
    props: { lng, lngDict, prevSelfUser: prevSelfUser },
  };
})

function MenuItems({ lng, lngDict, setDarkMode, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    id: prevSelfUser.id,
    email: prevSelfUser.email,
    user_name: prevSelfUser.user_name,
    first_name: prevSelfUser.first_name,
    last_name: prevSelfUser.last_name,
    locale: prevSelfUser.locale,
    dark_mode: prevSelfUser.dark_mode,
  });
  const [menuItemList, setMenuItemList] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const [unusedMenuItemList, setUnusedMenuItemList] = useState(['Item 5', 'Item 6', 'Item 7', 'Item 8']);
  
  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  const DragHandle = sortableHandle(() => 
    <DragHandleIcon />
  );
  const SortableMenuItemContainer = SortableContainer(({children}) => {
    return <List>{children}</List>;
  });

  const SortableUnusedMenuItem = SortableElement(({value}) => (
    <ListItem>
      <DragHandle />
      <IconButton
        onClick={() =>{
          if (menuItemList.length >= 5) {
            toast.error(i18n.t('_maxMenuItemNumberReached'));
          } else {
            setUnusedMenuItemList(unusedMenuItemList => not(unusedMenuItemList, value));
            setMenuItemList(menuItemList => menuItemList.concat(value));
          }
        }}
      >
        <AddIcon />
      </IconButton>
      {value}
    </ListItem>
  ));
  const onSortUnusedMenuItemEnd = ({oldIndex, newIndex}) => {
    setUnusedMenuItemList(unusedMenuItemList => arrayMove(unusedMenuItemList, oldIndex, newIndex));
  };

  const SortableMenuItem = SortableElement(({value}) => (
    <ListItem>
      <DragHandle />
      <IconButton
        onClick={() =>{
          setMenuItemList(menuItemList => not(menuItemList, value));
          setUnusedMenuItemList(UnusedMenuItemList => UnusedMenuItemList.concat(value));
        }}
      >
        <DeleteIcon />
      </IconButton>
      {value}
    </ListItem>
  ));
  const onSortMenuItemEnd = ({oldIndex, newIndex}) => {
    setMenuItemList(menuItemList => arrayMove(menuItemList, oldIndex, newIndex));
  };

  return (
    <Layout
      locale={lng}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('menuItems')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('menuItems')}
      >
      </Section>
      <Section
        title={i18n.t('unusedMenuItems')}
        titlePrefix={<IconButton><CheckBoxOutlineBlankIcon /></IconButton>}
      >
        <SortableMenuItemContainer onSortEnd={onSortUnusedMenuItemEnd} useDragHandle>
          {unusedMenuItemList.map((value, index) => (
            <SortableUnusedMenuItem key={`item-${value}`} index={index} value={value} />
          ))}
        </SortableMenuItemContainer>
      </Section>
      <Section
        title={i18n.t('usedMenuItems')}
        titlePrefix={<IconButton><CheckBoxIcon /></IconButton>}
      >
        <SortableMenuItemContainer onSortEnd={onSortMenuItemEnd} useDragHandle>
          {menuItemList.map((value, index) => (
            <SortableMenuItem key={`item-${value}`} index={index} value={value} />
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
              setDarkMode(selfUser.dark_mode);
              router.push('/myaccount/update/');
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
