import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { signIn, signOut, getSession, useSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import StorefrontIcon from '@material-ui/icons/Storefront';

import BusinessCard from '../../../components/BusinessCard';
import Layout from '../../../components/Layout'
import Section from '../../../components/Section'
import withAuth from '../../../components/withAuth'


function StoreID() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [store, setStore] = useState('');
  const [productList, setProductList] = useState('');

  const getStore = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/stores/" + router.query.id, {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
      setStore(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getProductList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/products", {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
      setProductList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStore()
    getProductList()
  },[])

  return (
    <Layout title="가게 - giveUcon">
      <Section
        backButton
        title="가게"
      >
      </Section>
      <Section
        title={store.name}
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
      >
        <Grid container>
          {productList && productList.map((item, key) => (
            <Grid item sm={12}>
              <BusinessCard
                title={item.name}
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => alert( 'Tapped' )}
                menuItems={
                  <><MenuItem>Menu Item</MenuItem><MenuItem>Menu Item</MenuItem></>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}

export default withAuth(StoreID);
