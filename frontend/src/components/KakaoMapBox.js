/*global kakao*/ 
import React from 'react';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import Skeleton from '@material-ui/lab/Skeleton';

const KakaoMaps = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 20rem;
`;

class KakaoMapBox extends React.Component{

  static defaultProps = {
    setLevel: ()=>{},
    setPosition: ()=>{}
  }

    componentDidMount() {
      const { latitude, longitude, setLevel, setPosition } = this.props;

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JAVASCRIPT_KEY}&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {

        kakao.maps.load(() => {
          let container = document.getElementById('kakao_map');
          let options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 7
          };
          var map = new window.kakao.maps.Map(container, options);
          var marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
          });
          marker.setMap(map);

          kakao.maps.event.addListener(map, 'center_changed', function() {
            setLevel(map.getLevel());
            setPosition({latitude: map.getCenter().La, longitude: map.getCenter().Ma}); 
          });
        });
      };
    }

    render() {
      const { skeleton } = this.props;
      if (skeleton) {
        return (
          <Skeleton animation='wave' variant='rect' width='100%' height='20rem' style={{borderRadius: '1rem'}}/>
        );
      } else {
        return(
        <Box>
          <KakaoMaps id='kakao_map' />
        </Box>
      );
    }
  }
}

export default KakaoMapBox;
