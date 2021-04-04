import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

const settings = {
  providers: [
/*
    Providers.Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
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
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    },
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
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }
  ],
  callbacks: {
    async signIn(user, account, profile) {
      // may have to switch it up a bit for other providers
      if (account.provider === "kakao") {
        // extract these two tokens
        const { accessToken } = account;
    
        // make a POST request to the DRF backend
        try {
          const response = await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            "http://localhost:8000/api/social/login/kakao/",
            {
              access_token: accessToken, // note the differences in key and value variable names
            },
          );
    
          // extract the returned token from the DRF backend and add it to the `user` object
          const { access_token, refresh_token } = response.data;
          user.accessToken = access_token;
          user.refreshToken = refresh_token;
          console.log("[...nextauth].js async signIn called");
          console.log(user.accessToken);
          console.log(user.refreshToken);
          return true; // return true if everything went well
        } catch (error) {
          console.log("[...nextauth].js async signIn called, ERROR OCCURRED");
          console.log(error);
          return false;
        }
      }
      return false; 
    },
    
    async jwt(token, user, account, profile, isNewUser) {
      console.log("[...nextauth].js : async jwt called");
      if (account?.accessToken) {
        try {
          await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            "http://localhost:8000/api/rest-auth/token/verify/",
            {
              token: user.accessToken,
            },
          );
        } catch (error) {
          const response = await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            "http://localhost:8000/api/rest-auth/token/refresh/",
            {
              refresh: user.refreshToken,
            },
          );
          const { access, refresh } = response.data;
          user.accessToken = access;
          user.refreshToken = refresh;
          console.log("[...nextauth].js : Tokens refreshed");
          console.log(user.accessToken);
          console.log(user.refreshToken);
        } finally {
          token.accessToken = user.accessToken
          token.refreshToken = user.refreshToken
        }
      }
      return token;
    },
    
    async session(session, token) {
      console.log("[...nextauth].js : async session called");
      try {
        await axios.post(
          // tip: use a seperate .ts file or json file to store such URL endpoints
          "http://localhost:8000/api/rest-auth/token/verify/",
          {
            token: token.accessToken,
          },
        );
      } catch (error) {
        const response = await axios.post(
          // tip: use a seperate .ts file or json file to store such URL endpoints
          "http://localhost:8000/api/rest-auth/token/refresh/",
          {
            refresh: token.refreshToken,
          },
        );
        const { access, refresh } = response.data;
        token.accessToken = access;
        token.refreshToken = refresh;
        console.log("[...nextauth].js : Tokens refreshed");
        console.log(token.accessToken);
        console.log(token.refreshToken);
      } finally {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
      }
      return session;
    },
  },
};

export default (req, res) =>
  NextAuth(req, res, settings);

