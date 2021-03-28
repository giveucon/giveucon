import React from 'react';
import Styled from 'styled-components'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const Title = Styled.h1`
  color: green;
  font-size: 50px;
`

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Title>/</Title>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Successfully launched
        </Typography>
      </Box>
      <Grid container justify="center">
        <div style={{ margin: 20 }}>
          <Grid item xs={12} align="center">
          <Button variant="outlined" onClick={() => router.push('/signin')}>Sign in</Button>
          </Grid>
        </div>
      </Grid>
    </Container>
  );
}
