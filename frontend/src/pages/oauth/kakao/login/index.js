export async function getServerSideProps() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}oauth/kakao/login/callback/`;
  const responseType = 'code';
  const state = process.env.NEXT_PUBLIC_KAKAO_APP_URL_PARAMETER_STATE;
  return {
    redirect: {
      permanent: false,
      destination: `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${state}`,
    }
  }
}

export default function Index() {}
