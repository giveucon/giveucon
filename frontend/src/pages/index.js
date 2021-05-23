import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    redirect: {
      destination: '/home/',
      permanent: false
    }
  }))

function Index() {

}

export default Index;
