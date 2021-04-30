export default async function convertImageToBase64Url (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  await xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};
