import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

import Layout from '../../components/Layout';
import Section from '../../components/Section';
import AccordionSection from '../../components/AccordionSection';
import ArticleBox from '../../components/ArticleBox';
import BusinessCard from '../../components/BusinessCard';
import KakaoMapCard from '../../components/KakaoMapCard';
import ListItemCard from '../../components/ListItemCard';
import SwipeableBusinessCards from '../../components/SwipeableBusinessCards';
import SwipeableTiles from '../../components/SwipeableTiles';
import Tile from '../../components/Tile';
import UserProfileBox from '../../components/UserProfileBox';
import UserProfileSection from '../../components/UserProfileSection';

export default function Index() {

  const swipeableBusinessCards = [
    <BusinessCard
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />,
    <BusinessCard
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />
  ]

  const swipeableTiles = [
    <Tile
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />,
    <Tile
      title="한글한글아름답게한글한글아름답게한글한글아름답게"
      image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />
  ]

  return (
    <Layout title={"컴포넌트 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>

      <Section
        backButton
        title="Page Title"
        titleSuffix={<IconButton><MenuIcon /></IconButton>}
      />

      <Section
        title="Section"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<IconButton><MenuIcon /></IconButton>}
      >
        <Typography variant="h5">Section children</Typography>
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

      <AccordionSection
        title="AccordionSection"
        defaultExpanded={true}
      >
        <Typography variant="h5">AccordionBox children</Typography>
      </AccordionSection>

      <Section
        title="ArticleBox"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <ArticleBox
          title="ArticleBox Title ArticleBox Title ArticleBox Title ArticleBox Title "
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          content="ArticleBox Content ArticleBox Content ArticleBox Content "
          onClick={() => alert( 'Tapped' )}
        >
          <Button>Edit</Button>
        </ArticleBox>
      </Section>

      <Section
        title="BusinessCard"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
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
                [<MenuItem>Menu Item</MenuItem>,<MenuItem>Menu Item</MenuItem>]
              }
            />
          </Grid>
          <Grid item xs={12}>
            <BusinessCard
              title="한글한글아름답게한글한글아름답게한글한글아름답게"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              actions={
                <Button>Edit</Button>
              }
            />
          </Grid>
        </Grid>
      </Section>

      <Section
        title="KakaoMapCard"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <KakaoMapCard latitude={37.506502} longitude={127.053617}/>
      </Section>

      <Section
        title="ListItemCard"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <ListItemCard
          primary="ListItemCard primary"
          secondary="ListItemCard secondary"
          onClick={() => alert( 'Tapped' )}
        />
        <ListItemCard
          primary="ListItemCard primary"
          secondary="ListItemCard secondary"
          prefix={<IconButton><MenuIcon /></IconButton>}
          onClick={() => alert( 'Tapped' )}
        />
        <ListItemCard
          primary="ListItemCard primary"
          secondary="ListItemCard secondary"
          suffix={<Button>Edit</Button>}
          onClick={() => alert( 'Tapped' )}
        />
      </Section>

      <Section
        title="SwipeableBusinessCards"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <SwipeableBusinessCards>
          {swipeableBusinessCards}
        </SwipeableBusinessCards>
      </Section>

      <Section
        title="SwipeableBusinessCards - with Autoplay"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <SwipeableBusinessCards autoplay={true} interval={5000}>
          {swipeableBusinessCards}
        </SwipeableBusinessCards>
      </Section>

      <Section
        title="SwipeableTiles"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <SwipeableTiles>
          {swipeableTiles}
        </SwipeableTiles>
      </Section>

      <Section
        title="Tile"
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
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
                [<MenuItem>Menu Item</MenuItem>,<MenuItem>Menu Item</MenuItem>]
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Tile
              title="한글한글아름답게한글한글아름답게한글한글아름답게"
              image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
              actions={
                <Button>Edit</Button>
              }
            />
          </Grid>
        </Grid>
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
