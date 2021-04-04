/*global kakao*/ 
import React from 'react';
import styled from "styled-components";


class Map extends React.Component{

    componentDidMount() {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=" + kakaoKey + "&autoload=false";
      document.head.appendChild(script);

      script.onload = () => {
        kakao.maps.load(() => {
          let container = document.getElementById("map");
          let options = {
            center: new window.kakao.maps.LatLng(37.506502, 127.053617),
            level: 7
          };

          var map = new window.kakao.maps.Map(container, options);
    
        });
      };
    }
    render(){
      return(
        <Maps id="map" />
      )
    }
}
const Maps = styled.div`
width: 400px;
height: 400px;
`;


export default Map;
