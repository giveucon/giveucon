export async function getServerSideProps(ctx) {
  return {
    redirect: {
      permanent: false,
      destination: `${process.env.NEXT_PUBLIC_BASE_URL}session/oauth/kakao/`,
    },
    props: {}
  };
}

export default function Login() {
 
}
