import React, { useEffect } from 'react';
import jsQR from 'jsqr';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

import Layout from 'components/Layout';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const putCouponScan = async (qrData) => await requestToBackend(null, 'api/coupons/scan/', 'put', 'json', qrData, null);

const getCoupon = async (qrData) => await requestToBackend(null, `api/coupons/${qrData.coupon}`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: { lng, lngDict, selfUser }
  }))

function Scan({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();

  useEffect(() => {
    const video = document.createElement('video');
    const canvasElement = document.getElementById('canvas');
    const canvas = canvasElement.getContext('2d');

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    async function verifyQRData(qrData) {
      const couponScanResponse = await putCouponScan(qrData);
      return couponScanResponse.data.valid;
    }

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
          try {
            const qrData = JSON.parse(code.data)
            if (verifyQRData(qrData)) {
              // console.log(video.srcObject.getTracks())
              video.srcObject.getTracks().forEach(
                track => {
                  track.stop();
                  video.srcObject.removeTrack(track);
                }
              )
              video.srcObject = null;
              router.push(`/coupons/${qrData.coupon}/`)
            }
          } catch (exception) {
            console.error(exception);
          }
        }
      }
      requestAnimationFrame(tick);
    }

    navigator
      .mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();
        requestAnimationFrame(tick);

      });
  }, []);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('scanCoupon')} - ${i18n.t('_appName')}`}
    >
      <Section backButton title={i18n.t('scanCoupon')}>
        <Card>
          <Box display='flex' justifyContent='center' style={{positions: 'responsive'}}>
            <canvas id='canvas' width='480' height='360' hidden />
          </Box>
        </Card>
      </Section>
    </Layout>
  );
}

export default Scan;
