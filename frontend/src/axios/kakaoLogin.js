import axios from 'axios'


const kakaoLogin = (accesstoken) => {
    axios.post('http://localhost:8000/auth/convert-token/', {
        token: accesstoken,
        backend: 'kakao-oauth2',
        grant_type: 'convert_token',
        client_id: 'a12940a709e7b194967dffacd43249a4',
        client_secret: '559293',
    })
    .then(res => {
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
    })
}

export default kakaoLogin
