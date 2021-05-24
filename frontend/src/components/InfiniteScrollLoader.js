import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function InfiniteScrollLoader({ loading=true }) {
  return (
    loading && (
      <Box display='flex' justifyContent='center' padding={2}>
        <CircularProgress />
      </Box>
    )
  );
}
