import React from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';

export default function ReviewListItem({ title=null, onClick=null, prefix=null, suffix=null, score=null, skeleton=false, subtitle=null }) {
  return (
    <Box marginY={1}>
      {
        skeleton ? (
          <Box display='flex' alignItems='center' justifyContent='flex-start' margin='1rem'>
            <Skeleton animation="wave" variant="circle" width='2rem' height='2rem'/>
            <Box flexGrow={1} margin='1rem'>
              <Skeleton animation="wave" width='100%' height='1rem'/>
              <Skeleton animation="wave" width='80%' height='1rem'/>
            </Box>
          </Box>
        ) : (
          <Card>
            <Box
              alignItems='center'
              display='flex'
              flexDirection='row'
              justifyContent='flex-start'
            >

              {/* Avatar, Icon, etc... */}
              <Box display={prefix ? 'block' : 'none'} margin='0.5rem'>
                {prefix}
              </Box>

              {/* Body */}
              <CardActionArea onClick={onClick}>
                <Box
                  display={(title || subtitle) ? 'block' : 'none'}
                  flexGrow={1}
                  paddingLeft={prefix ? 0 : 2}
                  paddingRight={suffix ? 0 : 2}
                  paddingY={1}
                >
                  <Typography variant='h6'>{title}</Typography>
                  <Box display='flex' alignItems='center'>
                    <Box marginRight={1}>
                      <Rating
                        value={score}
                        readOnly 
                      />
                    </Box>
                    <Divider orientation='vertical' flexItem />
                    <Box marginLeft={1}>
                      <Typography variant='subtitle2'>{subtitle}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardActionArea>

              {/* Button, etc... */}
              <Box display={suffix ? 'block' : 'none'} flexShrink={0}>
                {suffix}
              </Box>

            </Box>
          </Card>
        )
      }
    </Box>
  );
}
