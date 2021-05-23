import React from 'react';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

const KakaoMaps = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 20rem;
`;

class KakaoMapBox extends React.Component {

  componentDidMount() {
    const {location, enablePinMove} = this.props;
    window.kakao.maps.load(() => {
      const container = document.getElementById('kakaoMap');
      const options = {
        center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
        level: 7
      };
      const map = this.map = new window.kakao.maps.Map(container, options);
      this.geocoder = new window.kakao.maps.services.Geocoder();
      this.marker = new window.kakao.maps.Marker({
        map,
        location: new window.kakao.maps.LatLng(location.latitude, location.longitude)
      });
      this.moveMarker(location);
      const that = this;
      window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
        if (enablePinMove) {
          that.moveMarker({
            latitude: mouseEvent.latLng.getLat(),
            longitude: mouseEvent.latLng.getLng(),
          });
        }
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.location && (
      this.props.location.latitude !== nextProps.location.latitude
      || this.props.location.longitude !== nextProps.location.longitude
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps === null)
      return;
    this.moveMarker(this.props.location);
  }

  moveMarker(location) {
    const { latitude, longitude } = location;
    const { map, marker, geocoder } = this;
    const { setLevel, setLocation, setAddress } = this.props;
    geocoder.coord2Address(longitude, latitude, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
        marker.setPosition(new window.kakao.maps.LatLng(latitude, longitude));
        marker.setMap(map);
        map.panTo(new window.kakao.maps.LatLng(latitude, longitude));
        if (setLevel) setLevel(map.getLevel());
        if (setLocation) setLocation({latitude, longitude});
        if (setAddress) setAddress(detailAddr);
      }
    })
  }

  render() {
    return(
      <Box>
        <KakaoMaps id='kakaoMap' />
      </Box>
    );
  }
}

export default KakaoMapBox;
