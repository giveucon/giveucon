import nookies from 'nookies'

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  console.log(cookies.giveucon);
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
