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
          const { access_token } = response.data;
          user.accessToken = access_token;
    
          return true; // return true if everything went well
        } catch (error) {
          console.log(error);
          return false;
        }
        user.accessToken = accessToken;
      }
      return false; 
    },
    
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        const { accessToken } = user;
    
        // reform the `token` object from the access token we appended to the `user` object
        token.accessToken = accessToken;
      }
    
      return token;
    },
    
    async session(session, user) {
      session.accessToken = user.accessToken;
      return session;
    },
  },
};

export default (req, res) =>
  NextAuth(req, res, settings);

