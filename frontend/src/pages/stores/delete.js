import React, { useState } from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
  },
});

const getStore = async (session, id) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores/" + id, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteStore = async (session, store) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores/" + store.id + "/", {
        name: store.name,
        description: store.description,
        owner: store.owner,
      }, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const store = await getStore(session, context.query.id)
  return {
    props: { session, selfUser, store },
  }
})

function Delete({ session, selfUser, store }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={"가게 삭제 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        title="가게 삭제"
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Typography>경고: 이 작업 후에는 되돌릴 수 없습니다.</Typography>
        </Box>
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await deleteStore(session, store);
              router.push(`/stores/home`);
            }}
          >
            가게 삭제
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {router.back()}}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Delete;
