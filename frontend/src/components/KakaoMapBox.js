/*global kakao*/ 
import React from 'react';
import Head from 'next/head'
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
        latitude=37.56682420267543,
        longitude=126.978652258823,
        findCurrentLocation=false,
        setLevel,
        setPosition,
        setAddress
      } = this.props;

        kakao.maps.load(async () => {
          let container = document.getElementById('kakao_map');

          let options = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 7
          };
          var map = new kakao.maps.Map(container, options);
          var geocoder = new kakao.maps.services.Geocoder();
          var marker = new kakao.maps.Marker({  
            map,
            position: new kakao.maps.LatLng(latitude, longitude)
          });

          if (findCurrentLocation && navigator.geolocation) {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          }
          moveMarker(map, marker, latitude, longitude);
          
          kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            moveMarker(map, marker, mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng());
          });

          function moveMarker(map, marker, latitude, longitude) {
            geocoder.coord2Address(longitude, latitude, function(result, status) {
              if (status === kakao.maps.services.Status.OK) {
                var detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;

                marker.setPosition(new kakao.maps.LatLng(latitude, longitude));
                marker.setMap(map);
                map.panTo(new kakao.maps.LatLng(latitude, longitude));

                setLevel(map.getLevel());
                setPosition(latitude, longitude);
                setAddress(detailAddr);
              }
            });
          }

        });
    }

    render() {
      const { skeleton } = this.props;
      if (skeleton) {
        return (
          <Skeleton animation='wave' variant='rect' width='100%' height='20rem' style={{borderRadius: '1rem'}}/>
        );
      } else {
        return(
        <>
          <Head>
            <script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JAVASCRIPT_KEY}&autoload=false&libraries=services`}></script>
          </Head>
          <Box>
            <KakaoMaps id='kakao_map' />
          </Box>
        </>
      );
    }
  }
}

export default KakaoMapBox;
