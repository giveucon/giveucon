import React from 'react';
import Router from 'next/router'
import Axios from 'axios';
import Styled from 'styled-components'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


Test.getInitialProps = async () => {
  let response = null;
  try {
    response = await Axios.get('http://127.0.0.1:8000/accounts/user', { withCredentials: true } );
    console.log(response);
  } catch (error) {
    console.error(error);
  }

  const data = response?.request.data;
  console.log(`Data: ${data}`);

  return {
    props: { data },
  };
}

const Title = Styled.h1`
  color: green;
  font-size: 50px;
`

function Test({props}) {
  return (
    <Container maxWidth="sm">
      <Title>/test</Title>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          User: {props.data}
        </Typography>
      </Box>
      <Grid container justify="center">
        <div style={{ margin: 20 }}>
          <Grid item xs={12} align="center">
          <Button variant="outlined" onClick={() => Router.push('http://127.0.0.1:8000/accounts/kakao/login')}>Login</Button>
          </Grid>
        </div>
      </Grid>
      <Grid container justify="center">
        <div style={{ margin: 20 }}>
          <Grid item xs={12} align="center">
          <Button variant="outlined" onClick={() => Router.push('http://127.0.0.1:8000/accounts/logout')}>Logout</Button>
          </Grid>
        </div>
      </Grid>
    </Container>
  );
}

export default Test;
