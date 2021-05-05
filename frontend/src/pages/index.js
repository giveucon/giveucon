import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, darkMode, selfUser) => {
  return {
    redirect: {
      destination: '/home/',
      permanent: false
    }
  }
})

function Index() {
  
}

export default Index;
