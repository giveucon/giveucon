/*global kakao*/ 
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import styled from "styled-components";

const KakaoMaps = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 20rem;
`;

class KakaoMap extends React.Component{

    componentDidMount() {
      const { latitude, longitude } = this.props;

      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=" + process.env.NEXT_PUBLIC_KAKAO_APP_JAVASCRIPT_KEY + "&autoload=false";
      document.head.appendChild(script);

      script.onload = () => {
        kakao.maps.load(() => {
          let container = document.getElementById("kakao_map");
          let options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 7
          };

          var map = new window.kakao.maps.Map(container, options);

          var marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(latitude, longitude),
          });

          marker.setMap(map);
    
        });
      };
    }
    render(){
      const classes = makeStyles();
      return(
        <Card className={classes.card}>
          <KakaoMaps id="kakao_map" />
        </Card>
      )
    }
}

export default KakaoMap;
