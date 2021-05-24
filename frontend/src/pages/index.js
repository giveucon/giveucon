import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async () => ({
  redirect: {
    destination: '/home/',
    permanent: false
  }
}))

function Index() {}

export default Index;
