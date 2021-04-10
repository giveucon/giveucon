import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
  }));


export default function ListItemCard({ onClick=null, primary=null, prefix=null, secondary=null, suffix=null }) {
  const classes = useStyles();
  return (
    <Box marginY={1}>
      <Card>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Box display={prefix ? "block" : "none"}>
            {prefix}
          </Box>
            <CardActionArea onClick={onClick}>
              <Box
                display={(primary || secondary) ? "block" : "none"}
                paddingLeft={prefix ? 0 : 2}
                paddingRight={suffix ? 0 : 2}
                flexGrow={1}
                paddingY={1}
              >
                <Typography variant="h6">{primary}</Typography>
                <Typography variant="body2">{secondary}</Typography>
              </Box>
            </CardActionArea>
          <Box display={suffix ? "block" : "none"} flexShrink={0}>
            {suffix}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
