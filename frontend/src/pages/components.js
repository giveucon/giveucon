import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Layout from '../components/Layout';
import MenuItem from '@material-ui/core/MenuItem';

import Section from '../components/Section';
import BusinessCard from '../components/BusinessCard';
import SwipeableBusinessCards from '../components/SwipeableBusinessCards';
import SwipeableTiles from '../components/SwipeableTiles';
import Tile from '../components/Tile';
import UserListItem from '../components/UserListItem';
import UserProfileBox from '../components/UserProfileBox';
import UserProfileSection from '../components/UserProfileSection';
import MenuIcon from '@material-ui/icons/Menu';


export default function Index() {



  const swipeableBusinessCards = [
    <BusinessCard
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <><Button>Edit</Button></>
      }
    />,
    <BusinessCard
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <><Button>Edit</Button></>
      }
    />
  ]

  const swipeableTiles = [
    <Tile
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <><Button>Edit</Button></>
      }
    />,
    <Tile
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <><Button>Edit</Button></>
      }
    />
  ]

  return (
    <Layout title={"컴포넌트 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>

      <Section
        title="Section Head"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<><IconButton><MenuIcon /></IconButton></>}
      >
        <Typography variant="h4">Children</Typography>
      </Section>

      <Section
        backButton
        title="Section Head"
        titleSuffix={<><IconButton><MenuIcon /></IconButton></>}
      >
        <Typography variant="h4">Children</Typography>
      </Section>
      
      <Section title="Buttons">
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
      </Section>
      
      <Section title="Typography">
        <Typography variant="h1">Res. H1</Typography>
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
      </Section>

      <Section
        title="BusinessCard"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<><Button>Edit</Button></>}
      >
        <Grid container>
          <Grid item xs={12}>
            <BusinessCard
              title="Tile"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
            />
          </Grid>
          <Grid item xs={12}>
            <BusinessCard
              title="Tile"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              menuItems={
                <><MenuItem>Menu Item</MenuItem><MenuItem>Menu Item</MenuItem></>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <BusinessCard
              title="한글한글아름답게한글한글아름답게한글한글아름답게"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              actions={
                <><Button>Edit</Button></>
              }
            />
          </Grid>
        </Grid>
      </Section>

      <Section
        title="SwipeableBusinessCards"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<><Button>Edit</Button></>}
      >
        <SwipeableBusinessCards>
          {swipeableBusinessCards}
        </SwipeableBusinessCards>
      </Section>

      <Section
        title="SwipeableTiles"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<><Button>Edit</Button></>}
      >
        <SwipeableTiles>
          {swipeableTiles}
        </SwipeableTiles>
      </Section>

      <Section
        title="Tile"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<><Button>Edit</Button></>}
      >
        <Grid container>
          <Grid item xs={6}>
            <Tile
              title="Tile"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
            />
          </Grid>
          <Grid item xs={6}>
            <Tile
              title="Tile"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              menuItems={
                <><MenuItem>Menu Item</MenuItem><MenuItem>Menu Item</MenuItem></>
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Tile
              title="한글한글아름답게한글한글아름답게한글한글아름답게"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              actions={
                <><Button>Edit</Button></>
              }
            />
          </Grid>
        </Grid>
      </Section>


      <Section
        title="UserListItem"
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

      <Section title="UserProfileBox">
        <UserProfileBox
          name="Username"
          subtitle="Subtitle"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
        />
      </Section>

      <UserProfileSection
        name="Username"
        subtitle="Subtitle"
        image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
        actions={
          <IconButton><MenuIcon /></IconButton>
        }
      >
        <Typography variant="h4">This is UserProfileSection.</Typography>
      </UserProfileSection>

    </Layout>
  );
}
