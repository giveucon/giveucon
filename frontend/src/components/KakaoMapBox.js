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
    setPosition: ()=>{},
    setAddress: ()=>{}
  }

    componentDidMount() {
      const {
        initialLatitude,
        initialLongitude,
        findCurrentLocation=false,
        setLevel,
        setPosition,
        setAddress
      } = this.props;

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JAVASCRIPT_KEY}&autoload=false&libraries=services`;
      document.head.appendChild(script);

      script.onload = () => {

        kakao.maps.load(() => {
          let container = document.getElementById('kakao_map');
          let latitude = 37.506502;
          let longitude = 127.053617;

          let options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 7
          };
          var map = new window.kakao.maps.Map(container, options);
          var geocoder = new window.kakao.maps.services.Geocoder();
          var marker = new kakao.maps.Marker({  
              map,
              position: new window.kakao.maps.LatLng(latitude, longitude)
          });

          if (initialLatitude && initialLongitude) {
            latitude = initialLatitude;
            longitude = initialLongitude;
            displayMarker(latitude, longitude);
          } else if (findCurrentLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              displayMarker(latitude, longitude);        
            });
          } else {
            latitude = 37.506502;
            longitude = 127.053617;
            displayMarker(latitude, longitude);      
          }

          /*
          kakao.maps.event.addListener(map, 'center_changed', function() {
            setLevel(map.getLevel());
            setPosition({latitude: map.getCenter().La, longitude: map.getCenter().Ma});
          });
          */

          kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
              if (status === kakao.maps.services.Status.OK) {
                var detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;

                marker.setPosition(mouseEvent.latLng);
                marker.setMap(map);

                setLevel(map.getLevel());
                setPosition({latitude: mouseEvent.latLng.La, longitude: mouseEvent.latLng.Ma});
                setAddress(detailAddr);
              }
            });
          });

          function displayMarker(latitude, longitude) {
            var locPosition = new window.kakao.maps.LatLng(latitude, longitude);
            marker.setPosition(locPosition);
            marker.setMap(map);
            map.setCenter(locPosition);      
          }   

          function searchDetailAddrFromCoords(coords, callback) {
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
          }

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
