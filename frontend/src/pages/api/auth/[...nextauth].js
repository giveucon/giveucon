import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

const settings = {
  providers: [
    Providers.Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
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
          console.log(error);
          return false;
        }
      }
      return false; 
    },
    
    async jwt(token, user, account, profile, isNewUser) {
      if (account?.accessToken) {
        try {
          await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            "http://localhost:8000/api/jwt/token/verify/",
            {
              token: user.accessToken,
            },
          );
          token.accessToken = user.accessToken
          token.refreshToken = user.refreshToken
          console.log("[...nextauth].js : async jwt called");
        } catch (error) {
          const response = await axios.post(
            // tip: use a seperate .ts file or json file to store such URL endpoints
            "http://localhost:8000/api/jwt/token/refresh/",
            {
              refresh: user.refreshToken,
            },
          );
          const { access, refresh } = response.data;
          token.accessToken = access;
          token.refreshToken = refresh;
          console.log("[...nextauth].js : async jwt called, tokens refreshed");
          console.log(token.accessToken);
          console.log(token.refreshToken);
        }
      }
      return token;
    },
    
    async session(session, token) {
      try {
        await axios.post(
          // tip: use a seperate .ts file or json file to store such URL endpoints
          "http://localhost:8000/api/jwt/token/verify/",
          {
            token: token.accessToken,
          },
        );
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        console.log("[...nextauth].js : async session called");
      } catch (error) {
        const response = await axios.post(
          // tip: use a seperate .ts file or json file to store such URL endpoints
          "http://localhost:8000/api/jwt/token/refresh/",
          {
            refresh: token.refreshToken,
          },
        );
        const { access, refresh } = response.data;
        session.accessToken = access;
        session.refreshToken = refresh;
        console.log("[...nextauth].js : async session called, tokens refreshed");
        console.log(session.accessToken);
        console.log(session.refreshToken);
      }
      return session;
    },
  },
};

export default (req, res) =>
  NextAuth(req, res, settings);

