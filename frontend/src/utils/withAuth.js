import React from 'react';
import Router from 'next/router'

import requestToBackend from './requestToBackend'
import refreshSession from './refreshSession'

export default function withAuth(AuthComponent) {
  return class Authenticated extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selfUserResponse: null,
      };
    }

    async componentDidMount () {
      // If session is not found
      const session = await refreshSession();
      if (!session) {
        Router.push('/login/')
      } else {
        const selfUserResponse = await requestToBackend('api/users/self/', 'get', 'json');
        // If account founded but no user models linked
        if (selfUserResponse.status === 404) {
          Router.push('/users/create/')
        } else {
          await new Promise(r => setTimeout(r, 1000)); // For skeleton components test purpose
          this.setState({ selfUserResponse: selfUserResponse })
        }
      }
    }

    render() {
      if (this.state.selfUserResponse) {
        return (
          <AuthComponent
            {...this.props}
            selfUser={this.state.selfUserResponse.data}
          />
        )
      } else {
        return (
          <AuthComponent
            {...this.props}
            selfUser={null}
          />
        )
      }
    }
  }
}
