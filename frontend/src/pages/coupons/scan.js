import React from 'react';
import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import jsQR from "jsqr";
import Layout from '../../components/Layout';
import Section from '../../components/Section'

export default function Scanner() {
  const testRef = React.createRef();
  useEffect(() => {
    const video = document.createElement("video");
    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");
    const outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
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
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight * 0.5;
        canvasElement.width = video.videoWidth * 0.5;
        outputData.parentElement.hidden = true;
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
          outputData.parentElement.hidden = false;
          outputData.innerText = code.data;
          console.log(outputData.innerText)
        }
        else {
          outputData.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
  });

  return (
    <Layout title="쿠폰 스캔 - Give-U-Con">
      <Section backButton title='쿠폰 스캔'></Section>
      <Container maxWidth="sm">
        <Box>
          <canvas id="canvas" hidden></canvas>
        </Box>
        <Box>
          <span id="outputData"></span>
        </Box>
      </Container>
    </Layout>
  );
}
