import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';

export default function UserListItem({ content=null, image=null, name=null, onClick=null, suffix=null, skeleton=false }) {
  return (
    <>
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
          <>
            <CardActionArea onClick={onClick}>
              <Box
                alignItems='center'
                display='flex'
                flexDirection='row'
                justifyContent='flex-start'
              >
                <Box margin='0.5rem'>
                  <Avatar alt={name} src={image} />
                </Box>
                <Box
                  display={(name || content) ? 'block' : 'none'}
                  paddingLeft={2}
                  paddingRight={suffix ? 0 : 2}
                  paddingY={1}
                >
                  <Typography variant='h6'>{name}</Typography>
                  <Typography variant='subtitle2'>{content}</Typography>
                </Box>
              </Box>
            </CardActionArea>

            {/* Button, etc... */}
            <Box display={suffix ? 'block' : 'none'} flexShrink={0}>
              {suffix}
            </Box>
          </>
        )
      }
    </>
  );
}
