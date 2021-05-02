export async function getServerSideProps(ctx) {
  const client_id = process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY;
  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}oauth/kakao/login/callback/`;
  const response_type = 'code';
  const state = process.env.NEXT_PUBLIC_KAKAO_APP_URL_PARAMETER_STATE;
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
