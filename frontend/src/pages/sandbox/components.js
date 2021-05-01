import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

import Layout from 'components/Layout';
import Section from 'components/Section';
import AccordionSection from 'components/AccordionSection';
import AlertBox from 'components/AlertBox';
import KakaoMapBox from 'components/KakaoMapBox';
import NoticeBox from 'components/NoticeBox';
import ReviewBox from 'components/ReviewBox';
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import UserProfileBox from 'components/UserProfileBox';
import UserProfileSection from 'components/UserProfileSection';

export default function Components() {

  const swipeableTileList = [
    <Tile
      title='Swipeable Tile 1'
      image='https://cdn.pixabay.com/photo/2016/02/19/11/40/woman-1209862_960_720.jpg'
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />,
    <Tile
      title='Swipeable Tile 2'
      image='https://cdn.pixabay.com/photo/2018/04/04/01/51/girl-3288623_960_720.jpg'
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />,
    <Tile
      title='Swipeable Tile 3'
      image='https://cdn.pixabay.com/photo/2018/08/13/03/21/woman-3602245_960_720.jpg'
      onClick={() => alert( 'Tapped' )}
      actions={
        <Button>Edit</Button>
      }
    />
  ]

  return (
    <Layout title={`컴포넌트 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>

      <Section
        backButton
        title='Page Title'
        titleSuffix={<IconButton><MenuIcon /></IconButton>}
      />

      <Section
        title='Section'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<IconButton><MenuIcon /></IconButton>}
      >
        <Typography variant='h5'>Section children</Typography>
      </Section>

      <Section
        title='Section - without padding'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<IconButton><MenuIcon /></IconButton>}
        padding={false}
      >
        <Typography variant='h5'>I have no padding!</Typography>
      </Section>

      <AccordionSection
        title='AccordionSection'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        defaultExpanded={true}
      >
        <Typography variant='h5'>AccordionBox children</Typography>
      </AccordionSection>

      <AccordionSection
        title='AccordionSection - without padding'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        defaultExpanded={true}
        padding={false}
      >
        <Typography variant='h5'>I have no padding!</Typography>
      </AccordionSection>
      
      <Section
        skeleton={true}
      />

      <Section title='Buttons'>
        <Button variant='contained'>Default</Button>
        <Button variant='contained' color='primary'>Primary</Button>
        <Button variant='contained' color='secondary'>Secondary</Button>
        <Button variant='contained' disabled>Disabled</Button>
        <Button variant='contained' color='primary' href='#contained-buttons'>Link</Button>
        <Button>Default</Button>
        <Button color='primary'>Primary</Button>
        <Button color='secondary'>Secondary</Button>
        <Button disabled>Disabled</Button>
        <Button href='#text-buttons' color='primary'>Link</Button>
        <Button variant='outlined'>Default</Button>
        <Button variant='outlined' color='primary'>Primary</Button>
        <Button variant='outlined' color='secondary'>Secondary</Button>
        <Button variant='outlined' disabled>Disabled</Button>
        <Button variant='outlined' color='primary' href='#outlined-buttons'>Link</Button>
      </Section>
      
      <Section title='Typography'>
        <Typography variant='h1'>Res. H1</Typography>
        <Typography variant='h2'>Responsive H2</Typography>
        <Typography variant='h3'>Responsive H3</Typography>
        <Typography variant='h4'>Responsive H4</Typography>
        <Typography variant='h5'>Responsive H5</Typography>
        <Typography variant='h6'>Responsive H6</Typography>
        <Typography variant='subtitle1'>Subtitle 1</Typography>
        <Typography variant='subtitle2'>Subtitle 2</Typography>
        <Typography variant='body1'>Body 1</Typography>
        <Typography variant='body2'>Body 2</Typography>
        <Typography variant='button'>Button</Typography>
        <Typography variant='caption'>Caption</Typography>
        <Typography variant='overline'>Overline</Typography>
      </Section>

      <Section
        title='AlertBox'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <AlertBox skeleton />
        <AlertBox content='AlertBox Information' variant='information' />
        <AlertBox content='AlertBox Success' variant='success' />
        <AlertBox content='AlertBox Question' variant='question' />
        <AlertBox content='AlertBox Warning' variant='warning' />
        <AlertBox content='AlertBox Error' variant='error' />
      </Section>

      <Section
        title='KakaoMapBox'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <KakaoMapBox skeleton />
        <KakaoMapBox latitude={37.506502} longitude={127.053617}/>
      </Section>

      <Section
        title='ArticleBox'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <NoticeBox skeleton />
        <NoticeBox
          title='ArticleBox Title ArticleBox Title ArticleBox Title ArticleBox Title'
          subtitle='ArticleBox Subtitle ArticleBox Subtitle ArticleBox Subtitle ArticleBox Subtitle'
          imageList={['https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg']}
          content='ArticleBox Content ArticleBox Content ArticleBox Content '
          onClick={() => alert( 'Tapped' )}
        >
          <Button>Edit</Button>
        </NoticeBox>
      </Section>

      <Section
        title='ReviewBox'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <ReviewBox
          title='Review Box'
          subtitle='Review Author'
          imageList={['https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg']}
          content='Excellent'
          score={4}
          actions={<Button>Edit</Button>}
          onClick={() => alert( 'Tapped' )}
        />
      </Section>

      <Section
        title='SwipeableTileList'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
        padding={false}
      >
        <SwipeableTileList>
          {swipeableTileList}
        </SwipeableTileList>
      </Section>

      <Section
        title='SwipeableTileList - with Autoplay'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
        padding={false}
      >
        <SwipeableTileList autoplay={true} interval={5000}>
          {swipeableTileList}
        </SwipeableTileList>
      </Section>

      <Section
        title='SwipeableTileList - half'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
        padding={false}
      >
        <SwipeableTileList half>
          {swipeableTileList}
        </SwipeableTileList>
      </Section>

      <Section
        title='Tile'
        titlePrefix={<IconButton><MenuIcon /></IconButton>}
        titleSuffix={<Button>Edit</Button>}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Tile skeleton/>
          </Grid>
          <Grid item xs={6}>
            <Tile
              title='Tile'
              image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
              onClick={() => alert( 'Tapped' )}
            />
          </Grid>
          <Grid item xs={6}>
            <Tile
              title='Tile'
              image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
              onClick={() => alert( 'Tapped' )}
              menuItems={
                [<MenuItem>Menu Item</MenuItem>,<MenuItem>Menu Item</MenuItem>]
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Tile
              title='한글한글아름답게한글한글아름답게한글한글아름답게'
              image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
              onClick={() => alert( 'Tapped' )}
              actions={
                <Button>Edit</Button>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Tile skeleton/>
          </Grid>
          <Grid item xs={12}>
            <Tile
              title='한글한글아름답게한글한글아름답게한글한글아름답게'
              subtitle='조금조금아름답게조금조금아름답게조금조금아름답게'
              image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
              onClick={() => alert( 'Tapped' )}
              actions={
                <Button>Edit</Button>
              }
            />
          </Grid>
        </Grid>
      </Section>

      <Section title='UserProfileBox'>
        <UserProfileBox skeleton />
        <UserProfileBox
          name='Username'
          subtitle='Subtitle'
          image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
        />
      </Section>

      <UserProfileSection
        name='Username'
        subtitle='Subtitle'
        image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
        actions={
          <IconButton><MenuIcon /></IconButton>
        }
      >
        <Typography variant='h4'>This is UserProfileSection.</Typography>
      </UserProfileSection>

    </Layout>
  );
}
