import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import jsQR from 'jsqr';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

import Layout from '../../components/Layout';
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

const putCouponScan = async (qrData) => {
  const data = {
    qr_data: qrData
  };
  return await requestToBackend('api/coupons/scan/', 'put', 'json', data, null);
};

const getCoupon = async (qrData) => {
  return await requestToBackend(`api/products/${qrData.id}`, 'get', 'json');
};

function Scan({ selfUser }) {
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
      if (couponScanResponse.status === 200) {
        const couponResponse = await getCoupon(qrData);
        if (couponResponse.status === 200) return true;
        else return false;
      }
      else return false;
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
          const qrData = JSON.parse(code.data)
          if (verifyQRData(qrData) === true) {
            console.log(video.srcObject.getTracks())
            video.srcObject.getTracks().forEach(
              track => {
                track.stop();
                video.srcObject.removeTrack(track);
              }
            )
            video.srcObject = null;
            router.push(`/coupons/${qrData.coupon}/`)
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
  });

  return (
    <Layout title={`쿠폰 스캔 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section backButton title='쿠폰 스캔'>
        <Card>
          <Box display='flex' justifyContent='center' style={{positions: 'responsive'}}> 
            <canvas id='canvas' width='480' height='360' hidden></canvas>
          </Box>
        </Card>
      </Section>
    </Layout>
  );
}

export default withAuth(Scan);
