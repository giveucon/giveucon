import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Layout from '../components/Layout';
import MenuItem from '@material-ui/core/MenuItem';
import Section from '../components/Section';
import ProductTile from '../components/ProductTile';
import UserListItem from '../components/UserListItem';
import UserProfileBox from '../components/UserProfileBox';
import MenuIcon from '@material-ui/icons/Menu';


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
      

      <OverviewBox title="ProductTile">
        <ProductTile
          name="ProductTile"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          onClick={() => alert( 'Tapped' )}
        />
      </OverviewBox>

      <OverviewBox title="ProductTile - with Section">
        <Section
          title="Product List"
          titlePrefix={<IconButton><MenuIcon /></IconButton>}
          titleSuffix={<><Button>Edit</Button></>}
        >
          <Grid container>
            <Grid item sm={6}>
              <ProductTile
                name="ProductTileProductTile"
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => alert( 'Tapped' )}
              />
            </Grid>
            <Grid item sm={6}>
              <ProductTile
                name="ProductTile"
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => alert( 'Tapped' )}
              />
            </Grid>
            <Grid item sm={6}>
              <ProductTile
                name="ProductTile"
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => alert( 'Tapped' )}
                menuItems={
                  <MenuItem>Menu Item</MenuItem>
                }
              />
            </Grid>
          </Grid>
        </Section>
      </OverviewBox>


      <OverviewBox title="UserListItem">
        <UserListItem
          name="UserListItem"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          onClick={() => alert( 'Tapped' )}
        />
      </OverviewBox>

      <OverviewBox title="UserListItem - with Section">
        <Section
          title="User List"
          titlePrefix={<IconButton><MenuIcon /></IconButton>}
          titleSuffix={<Button>Edit</Button>}
        >
          <List>
            <UserListItem
              name="UsernameUsernameUsernameUsernameUsername"
              content="asdfasdf"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
            />
            <UserListItem
              name="Username"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
            />
            <UserListItem
              name="Username"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              menuItems={
                <MenuItem>Menu Item</MenuItem>
              }
            />
          </List>
        </Section>
      </OverviewBox>

      <OverviewBox title="UserProfileBox">
        <UserProfileBox
          name="Username"
          subtitle="Subtitle"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          actions={
            <IconButton><MenuIcon /></IconButton>
          }
        >
          <Typography variant="h4">Children</Typography>
        </UserProfileBox>
      </OverviewBox>

    </Container>
    </Layout>
  );
}
