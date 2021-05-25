import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function AccordionSection({ backButton=false, children=null, defaultExpanded=false, padding=true, title=null, titlePrefix=null }) {

  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const handleAccordionChange = () => () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion defaultExpanded expanded={expanded} onChange={handleAccordionChange()}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          alignItems='center'
          display='flex'
          flexDirection='row'
          justifyContent='flex-start'
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
            paddingLeft={(backButton || titlePrefix) ? 0 : 2}
            paddingY={1}
          >
            <Typography variant='h6'>{title}</Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <Box padding={ padding ? 1 : 0 }>
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
