import React from 'react';
import Router from 'next/router'

import requestToBackend from './requestToBackend'
import refreshSession from './refreshSession'

export default function withAuth(AuthComponent) {
  return class Authenticated extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authLoading: true,
        selfUserResponse: null,
      };
    }
    async componentDidMount () {
      // If session is not found
      const session = await refreshSession();
      if (!session) {
        Router.push('/login/')
      }
      const selfUserResponse = await requestToBackend('api/users/self/', 'get', 'json');
      // If account founded but no user models linked
      if (selfUserResponse.status === 404) {
        Router.push('/users/create/')
      } else {
        this.setState({ selfUserResponse: selfUserResponse })
        this.setState({ authLoading: false })
      }
    }
    render() {
      return (
        <>
          {this.state.authLoading ? (
            <AuthComponent
              {...this.props}
              selfUser={null}
            />
          ) : (
            <AuthComponent
              {...this.props}
              selfUser={this.state.selfUserResponse.data}
            />
          )}
        </>
      )
    }
  }
}
