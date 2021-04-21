import nookies from 'nookies'

export async function getServerSideProps(ctx) {
  nookies.destroy(ctx, 'giveucon', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })
  return {
    redirect: {
      permanent: false,
      destination: `${process.env.NEXTAUTH_URL}`,
    },
    props: {}
  };
}

export default function Logout() {
 
}
