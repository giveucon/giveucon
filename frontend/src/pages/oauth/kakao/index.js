import { useRouter } from 'next/router'

Index.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.

  const client_id = process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY;
  const redirect_uri = process.env.NEXTAUTH_URL + 'oauth/kakao/callback/';
  const response_type = 'code';
  const state = 'some random string to protect against cross-site request forgery attacks';
  const prompt = null;

  if (ctx.res) {
    ctx.res.writeHead(302, { Location: `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&state=${state}` });
    ctx.res.end();
  }
  return { };
}

export default function Index() {

  
  return null;
}
