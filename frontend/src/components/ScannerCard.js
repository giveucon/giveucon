import React from 'react';
import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import jsQR from "jsqr";

export default function Scanner() {

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
    navigator
    .mediaDevices
    .getUserMedia({ video: { 
      facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();
      requestAnimationFrame(tick);

    });
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, video.videoWidth, video.videoHeight);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          alert(code.data)
          return
        }
      }
      requestAnimationFrame(tick);
    } 
  });

  return (
    <Card>
      <Box display="flex" justifyContent="center" style={{positions: "responsive"}}> 
        <canvas id="canvas" width="480" height="360" hidden></canvas>
      </Box>
    </Card>
  );
}