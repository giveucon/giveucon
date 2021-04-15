import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import axios from 'axios';

const settings = {
  providers: [
/*
    Providers.Kakao({
      clientId: process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_APP_CLIENT_SECRET,
    }),
*/
// https://github.com/nextauthjs/next-auth/blob/main/src/providers/kakao.js
    {
      id: 'kakao',
      name: 'Kakao',
      type: 'oauth',
      version: '2.0',
      params: { grant_type: 'authorization_code' },
      accessTokenUrl: 'https://kauth.kakao.com/oauth/token',
      authorizationUrl: 'https://kauth.kakao.com/oauth/authorize?response_type=code',
      profileUrl: 'https://kapi.kakao.com/v2/user/me',
      async profile(profile, tokens) {
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth provider does not return e-mail by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return {
          id: profile.id,
          name: profile.kakao_account?.profile.nickname,
          email: profile.kakao_account?.email,
          image: profile.kakao_account?.profile.profile_image_url
        }
      },
      clientId: process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_APP_CLIENT_SECRET,
    },
/*
    {
      id: 'kakao_reauthenticate',
      name: 'Kakao(Reauthenticate)',
      type: 'oauth',
      version: '2.0',
      params: { grant_type: 'authorization_code' },
      accessTokenUrl: 'https://kauth.kakao.com/oauth/token',
      authorizationUrl: 'https://kauth.kakao.com/oauth/authorize?response_type=code&prompt=login',
      profileUrl: 'https://kapi.kakao.com/v2/user/me',
      async profile(profile, tokens) {
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth provider does not return e-mail by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return {
          id: profile.id,
          name: profile.kakao_account?.profile.nickname,
          email: profile.kakao_account?.email,
          image: profile.kakao_account?.profile.profile_image_url
        }
      },
      clientId: process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_APP_CLIENT_SECRET,
    }
*/
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log('[...nextauth].js : async signIn called');
      // may have to switch it up a bit for other providers
      if (account.provider === 'kakao') {
        // extract these two tokens
        const { accessToken } = account;
    
        // make a POST request to the DRF backend
        try {
          const socialLoginResponse = await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/social/login/kakao/`, {
              access_token: accessToken, // note the differences in key and value variable names
            },
          );
          user.accessToken = socialLoginResponse.data.access_token;
          user.refreshToken = socialLoginResponse.data.refresh_token;

          const tokenRefreshResponse = await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/rest-auth/token/refresh/`, {
              refresh: socialLoginResponse.data.refresh_token,
            },
          );
    
          // extract the returned token from the DRF backend and add it to the `user` object
          user.accessToken = tokenRefreshResponse.data.access;
          user.refreshToken = tokenRefreshResponse.data.refresh;
          user.accessTokenLifetime = tokenRefreshResponse.data.access_lifetime;
          user.refreshTokenLifetime = tokenRefreshResponse.data.refresh_lifetime;
          user.accessTokenExpiry = tokenRefreshResponse.data.access_expiry;
          user.refreshTokenExpiry = tokenRefreshResponse.data.refresh_expiry;
          console.log('[...nextauth].js async signIn called');
          console.log('Access Token : ' + user.accessToken);
          console.log('Refresh Token : ' + user.refreshToken);
          console.log('Access Token Expiry : ' + user.accessTokenExpiry);
          console.log('Refresh Token Expiry : ' + user.refreshTokenExpiry);

          return true; // return true if everything went well
        } catch (error) {
          console.log('[...nextauth].js async signIn called, ERROR OCCURRED');
          console.log(error);
          return false;
        }
      }
      return false; 
    },
    
    async jwt(token, user, account, profile, isNewUser) {
      console.log('[...nextauth].js : async jwt called');
      if (user && user.accessToken) {
        /*
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/rest-auth/token/verify/`, {
              token: user.accessToken,
            },
          );
        } catch (error) {
          const tokenRefreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/rest-auth/token/refresh/`, {
              refresh: user.refreshToken,
            },
          );
          user.accessToken = tokenRefreshResponse.data.access;
          user.refreshToken = tokenRefreshResponse.data.refresh;
          user.accessTokenLifetime = tokenRefreshResponse.data.access_lifetime;
          user.refreshTokenLifetime = tokenRefreshResponse.data.refresh_lifetime;
          user.accessTokenExpiry = tokenRefreshResponse.data.access_expiry;
          user.refreshTokenExpiry = tokenRefreshResponse.data.refresh_expiry;
          console.log('[...nextauth].js : Tokens refreshed');
          console.log('Access token : ' + user.accessToken);
          console.log('Refresh token : ' + user.refreshToken);
          console.log('Access Token Expiry : ' + user.accessTokenExpiry);
          console.log('Refresh Token Expiry : ' + user.refreshTokenExpiry);
        } finally {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenLifetime = user.accessTokenLifetime;
          token.refreshTokenLifetime = user.refreshTokenLifetime;
          token.accessTokenExpiry = user.accessTokenExpiry;
          token.refreshTokenExpiry = user.refreshTokenExpiry;
        }
        */
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenLifetime = user.accessTokenLifetime;
        token.refreshTokenLifetime = user.refreshTokenLifetime;
        token.accessTokenExpiry = user.accessTokenExpiry;
        token.refreshTokenExpiry = user.refreshTokenExpiry;
      }
      return token;
    },
    
    async session(session, token) {
      console.log('[...nextauth].js : async session called');
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/rest-auth/token/verify/`, {
            token: token.accessToken,
          },
        );
      } catch (error) {
        const tokenRefreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/rest-auth/token/refresh/`, {
            refresh: token.refreshToken,
          },
        );

        token.accessToken = tokenRefreshResponse.data.access;
        token.refreshToken = tokenRefreshResponse.data.refresh;
        token.accessTokenLifetime = tokenRefreshResponse.data.access_lifetime;
        token.refreshTokenLifetime = tokenRefreshResponse.data.refresh_lifetime;
        token.accessTokenExpiry = tokenRefreshResponse.data.access_expiry;
        token.refreshTokenExpiry = tokenRefreshResponse.data.refresh_expiry;
        console.log('[...nextauth].js : Tokens refreshed');
        console.log('Access token : ' + token.accessToken);
        console.log('Refresh token : ' + token.refreshToken);
        console.log('Access Token Expiry : ' + token.accessTokenExpiry);
        console.log('Refresh Token Expiry : ' + token.refreshTokenExpiry);
      } finally {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.accessTokenLifetime = token.accessTokenLifetime;
        session.refreshTokenLifetime = token.refreshTokenLifetime;
        session.accessTokenExpiry = token.accessTokenExpiry;
        session.refreshTokenExpiry = token.refreshTokenExpiry;
      }
      /*
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenLifetime = token.accessTokenLifetime;
      session.refreshTokenLifetime = token.refreshTokenLifetime;
      session.accessTokenExpiry = token.accessTokenExpiry;
      session.refreshTokenExpiry = token.refreshTokenExpiry;
      */
      return session;
    },
  },
  events: {
    async signIn(message) { 
      console.log('[...nextauth].js : signIn event occurred');
    },
    async signOut(message) { 
      console.log('[...nextauth].js : signOut event occurred');
    },
    async createUser(message) { 
      console.log('[...nextauth].js : createUser event occurred');
    },
    async linkAccount(message) { 
      console.log('[...nextauth].js : linkAccount event occurred');
    },
    async session(message) { 
      console.log('[...nextauth].js : session event occurred');
    },
    async error(message) { 
      console.log('[...nextauth].js : error event occurred');
      console.log(message);
    },
  },
};

export default (req, res) =>
  NextAuth(req, res, settings);

