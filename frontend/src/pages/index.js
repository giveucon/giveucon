import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components'

const Title = styled.h1`
  color: green;
  font-size: 50px;
`

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Title>Front-end</Title>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Successfully launched
        </Typography>
      </Box>
    </Container>
  );
}