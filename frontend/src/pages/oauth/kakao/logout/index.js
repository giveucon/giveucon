export async function getServerSideProps(ctx) {
  const client_id = process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY;
  const logout_redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}oauth/kakao/logout/callback/`;
  const state = process.env.NEXT_PUBLIC_KAKAO_APP_URL_PARAMETER_STATE;
  return {
    redirect: {
      permanent: false,
      destination: `https://kauth.kakao.com/oauth/logout?client_id=${client_id}&logout_redirect_uri=${logout_redirect_uri}&state=${state}`,
    },
    props: {}
  };
}

export default function Index() {
  
}
