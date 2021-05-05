import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    redirect: {
      destination: '/central-notices/list/',
      permanent: false
    }
  }
})

function Index() {
  
}

export default Index;
