import React from 'react';
import Head from 'next/head'
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

const KakaoMaps = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 20rem;
`;

class KakaoMapBox extends React.Component {
  moveMarker(position) {
    const { latitude, longitude } = position;
    const { map, marker, geocoder } = this;
    const { setLevel, setPosition, setAddress } = this.props;
    geocoder.coord2Address(longitude, latitude, function(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
        marker.setPosition(new kakao.maps.LatLng(latitude, longitude));
        marker.setMap(map);
        map.panTo(new kakao.maps.LatLng(latitude, longitude));
        setLevel && setLevel(map.getLevel());
        setPosition && setPosition({latitude, longitude});
        setAddress && setAddress(detailAddr);
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps === null)
      return;
    this.moveMarker(this.props.position);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.position.latitude !== nextProps.position.latitude
    || this.props.position.longitude !== nextProps.position.longitude;
  }

  componentDidMount() {
    const { position } = this.props;
    kakao.maps.load(() => {
      const container = document.getElementById('kakao_map');
      const options = {
        center: new kakao.maps.LatLng(position.latitude, position.longitude),
        level: 7
      };
      const map = this.map = new kakao.maps.Map(container, options);
      this.geocoder = new kakao.maps.services.Geocoder();
      this.marker = new kakao.maps.Marker({  
        map,
        position: new kakao.maps.LatLng(position.latitude, position.longitude)
      });
      this.moveMarker(position);
      const that = this;
      kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
        that.moveMarker({
          latitude: mouseEvent.latLng.getLat(),
          longitude: mouseEvent.latLng.getLng(),
        });
      });
    });
  }

  render() {
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

export default KakaoMapBox;
