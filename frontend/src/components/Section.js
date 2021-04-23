import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default function Section({ backButton=false, children=null, padding=true, title=null, titlePrefix=null, titleSuffix=null, skeleton=false }) {
  const router = useRouter();
  return (
    <Box marginY={2}>
      {
        skeleton ? (
          <Box paddingX={1} paddingY={0.5}>
            <Box
              display='flex'
              alignItems='center'
              flexDirection='row'
              justifyContent='flex-start'
            >
              <Box margin={0.5}>
                <Skeleton animation='wave' variant='circle' width={30} height={30} />
              </Box>
              <Box margin={0.5} flexGrow={1}>
                <Skeleton animation='wave' height={10} style={{ marginBottom: '0.25rem' }} />
                <Skeleton animation='wave' height={10} width='80%' />  
              </Box>
            </Box>
            <Box marginX={0.5} marginY={1}>
              <Skeleton animation='wave' variant='rect' width='100%' height={200} style={{borderRadius: '1rem'}} />
            </Box>
          </Box>
        ) : (
          <Paper>
            <Box
              alignItems='center'
              display='flex'
              flexDirection='row'
              justifyContent='flex-start'
              paddingX={1}
            >
              <Box display={backButton ? 'block' : 'none'}>
                <IconButton
                  onClick={() => {router.back()}}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              <Box display={titlePrefix ? 'block' : 'none'}>
                {titlePrefix}
              </Box>
              <Box
                display={title ? 'block' : 'none'}
                flexGrow={1}
                paddingLeft={(backButton || titlePrefix) ? 0 : 2}
                paddingRight={(titleSuffix) ? 0 : 2}
                paddingY={1}
              >
                <Typography variant='h6'>{title}</Typography>
              </Box>
              <Box display={titleSuffix ? 'block' : 'none'} flexShrink={0}>
                {titleSuffix}
              </Box>
            </Box>
            <Box display={(backButton || titlePrefix || title || titleSuffix) && children ? 'block' : 'none'} >
              <Divider />
            </Box>
            <Box display={children ? 'block' : 'none'} padding={ padding ? 1 : 0}>
              {children}
            </Box>
          </Paper>
        )
      }
    </Box>
  );
}
