export async function getServerSideProps() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY;
  const logoutRedirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}oauth/kakao/logout/callback/`;
  const state = process.env.NEXT_PUBLIC_KAKAO_APP_URL_PARAMETER_STATE;
  return {
    redirect: {
      permanent: false,
      destination: `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${logoutRedirectUri}&state=${state}`,
    },
    props: {}
  };
}

export default function Index() {}
