export async function getServerSideProps(ctx) {
  return {
    redirect: {
      permanent: false,
      destination: `${process.env.NEXTAUTH_URL}session/oauth/kakao/`,
    },
    props: {}
  };
}

export default function Login() {
 
}
