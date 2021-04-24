import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default function InfiniteScrollLoader({ loading=true }) {
  return (
    <Box display='flex' justifyContent='center' padding={2}>
      {loading && (
        <CircularProgress />
      )}
      {!loading && (
        <Typography variant='subtitle2'>항목이 더 이상 없습니다.</Typography>
      )}
    </Box>
  );
}
