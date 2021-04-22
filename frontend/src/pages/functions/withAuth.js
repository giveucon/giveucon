import React from 'react';
import Router from 'next/router'
import { parseCookies } from 'nookies'

import backendFetcher from './backendFetcher'

export default function withAuth(AuthComponent) {
    return class Authenticated extends React.Component {

      constructor(props) {
        super(props)
        this.state = {
          isLoading: true
        };
      }

      async componentDidMount () {
        const cookies = parseCookies();
        const session = cookies.giveucon ? JSON.parse(cookies.giveucon) : null;
    
        // If session is not found
        if (!session) {
          Router.push('/login/')
        }
        
        const selfUserResponse = await backendFetcher('api/users/self/', 'get', 'json');
    
        console.log(selfUserResponse.status);
        // If account founded but no user models linked
        if (selfUserResponse.status === 404) {
          Router.push('/users/create/')
        }
        const selfUser = selfUserResponse.data;
        this.setState({ isLoading: false })
      }

      render() {
        return (
          <div>
          {this.state.isLoading ? (
              <div>LOADING....</div>
            ) : (
              <AuthComponent {...this.props} />
            )}
          </div>
        )
      }
    }
}