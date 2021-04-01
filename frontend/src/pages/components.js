import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

import Layout from '../components/Layout';
import Section from '../components/Section';


function OverviewBox({ title, children }) {
  return (
    <Box m={2}>
      <Paper elevation={1}>
        <Box p={2}>
          <Typography variant="h5">{title}</Typography>
        </Box>
        <Divider />
        <Box p={2}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}

export default function Index() {
  return (
    <Layout>
    <Container maxWidth="sm">

      <OverviewBox title="Button">
        <Button variant="contained">Default</Button>
        <Button variant="contained" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="contained" disabled>Disabled</Button>
        <Button variant="contained" color="primary" href="#contained-buttons">Link</Button>
        <Button>Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
        <Button href="#text-buttons" color="primary">Link</Button>
        <Button variant="outlined">Default</Button>
        <Button variant="outlined" color="primary">Primary</Button>
        <Button variant="outlined" color="secondary">Secondary</Button>
        <Button variant="outlined" disabled>Disabled</Button>
        <Button variant="outlined" color="primary" href="#outlined-buttons">Link</Button>
      </OverviewBox>
      
      <OverviewBox title="Typography">
        <Typography variant="h1">Responsive H1</Typography>
        <Typography variant="h2">Responsive H2</Typography>
        <Typography variant="h3">Responsive H3</Typography>
        <Typography variant="h4">Responsive H4</Typography>
        <Typography variant="h5">Responsive H5</Typography>
        <Typography variant="h6">Responsive H6</Typography>
        <Typography variant="subtitle1">Subtitle 1</Typography>
        <Typography variant="subtitle2">Subtitle 2</Typography>
        <Typography variant="body1">Body 1</Typography>
        <Typography variant="body2">Body 2</Typography>
        <Typography variant="button">Button</Typography>
        <Typography variant="caption">Caption</Typography>
        <Typography variant="overline">Overline</Typography>
      </OverviewBox>

      <OverviewBox title="Section">
        <Section
          backButton
          title="Section Head"
          titlePrefix={<IconButton><MenuIcon /></IconButton>}
          titleSuffix={<><Button>Button 1</Button><Button>Button 2</Button></>}
        >
          <Typography variant="h4">Section Body</Typography>
        </Section>
      </OverviewBox>


    </Container>
    </Layout>
  );
}
