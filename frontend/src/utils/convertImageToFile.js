export default async function convertImageToFile (url, fileName, callback) {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, {type: blob.type});
  callback(file);
};
