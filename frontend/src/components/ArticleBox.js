import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      paddingTop: "42.86%", // 21:9,
      // paddingTop: "56.25%", // 16:9,
    },
  }));

export default function UserProfileBox({ children=null, content=null, image=null, onClick=null, title=null }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);

  const handleAccordionChange = () => (event) => {
    setExpanded(!expanded);
  };

  return (
    <Box paddingX={0.5}>
      <Box paddingY={1}>
        <Card>
          <CardActionArea onClick={onClick}>
            <CardMedia
              className={classes.media}
              image={image}
              title={title}
            />
          </CardActionArea>
        </Card>
      </Box>
      <Box paddingY={1}>
        <Accordion defaultExpanded expanded={expanded} onChange={handleAccordionChange()}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">{title}</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Box>
              <Typography variant="body1">{content}</Typography>
              {children}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
