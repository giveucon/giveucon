import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function AccordionSection({ children=null, defaultExpanded=false, title=null }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleAccordionChange = () => (event) => {
    setExpanded(!expanded);
  };

  return (
    <Accordion defaultExpanded expanded={expanded} onChange={handleAccordionChange()}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
