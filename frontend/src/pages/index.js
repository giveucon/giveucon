import withAuthServerSideProps from './withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { selfUser },
  }
})

export default function Index({}) {
  return null;
}
