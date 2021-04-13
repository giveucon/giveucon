import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import jsQR from "jsqr";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import Layout from '../../components/Layout';
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const putCouponScan = async (session, qrData) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons/scan/`, {
        qr_data: qrData,
      }, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { session, selfUser },
  }
})

function Scan({ session, selfUser }) {
  const router = useRouter();

  useEffect(() => {
    const video = document.createElement("video");
    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    async function verifyQRData(session, qrData) {
      const response = await putCouponScan(session, qrData);
      if (response.status === 200) return true;
      else return false;
    }

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          const qrData = JSON.parse(code.data)
          if (verifyQRData(session, qrData)) {
            console.log(video.srcObject.getTracks())
            video.srcObject.getTracks().forEach(
              track => {
                track.stop();
                video.srcObject.removeTrack(track);
              }
            )
            video.srcObject = null;
            router.push(`/coupons/${qrData.coupon}`)
          }
        }
      }
      requestAnimationFrame(tick);
    }

    navigator
      .mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);

      });
  });

  return (
    <Layout title={`쿠폰 스캔 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section backButton title='쿠폰 스캔'>
        <Card>
          <Box display="flex" justifyContent="center" style={{positions: "responsive"}}> 
            <canvas id="canvas" width="480" height="360" hidden></canvas>
          </Box>
        </Card>
      </Section>
    </Layout>
  );
}

export default Scan;
