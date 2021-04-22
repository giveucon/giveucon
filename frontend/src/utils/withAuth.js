import React from 'react';
import Router from 'next/router'

import fetchFromBackend from './fetchFromBackend'
import verifySession from './verifySession'

export default function withAuth(AuthComponent) {
  return class Authenticated extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        loading: true,
        selfUser: null,
      };
    }
    async componentDidMount () {
      // If session is not found
      const session = await verifySession();
      if (!session) {
        Router.push('/login/')
      }
      const selfUserResponse = await fetchFromBackend('api/users/self/', 'get', 'json');
      // If account founded but no user models linked
      if (selfUserResponse.status === 404) {
        Router.push('/users/create/')
      } else {
        this.setState({ selfUser: selfUserResponse.data })
        this.setState({ loading: false })
      }
    }
    render() {
      return (
        <>
          {this.state.loading ? (
            <div>LOADING....</div>
          ) : (
            <AuthComponent {...this.props} selfUser={this.state.selfUser}/>
          )}
        </>
      )
    }
  }
}
