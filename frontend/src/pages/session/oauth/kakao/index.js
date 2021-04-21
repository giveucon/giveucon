export async function getServerSideProps(ctx) {
  const client_id = process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY;
  const redirect_uri = `${process.env.NEXTAUTH_URL}session/oauth/kakao/callback/`;
  const response_type = 'code';
  const state = 'some random string';
  const prompt = null;
  return {
    redirect: {
      permanent: false,
      destination: `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&state=${state}`,
    },
    props: {}
  };
}

export default function Index() {
  
}
