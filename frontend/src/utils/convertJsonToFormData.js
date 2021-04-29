// https://github.com/hyperatom/json-form-data

function isArray(val) {
  return ({}).toString.call(val) === '[object Array]';
}

function isJsonObject(val) {
  return !isArray(val) && typeof val === 'object' && !!val && !(val instanceof Blob) && !(val instanceof Date);
}

function convertJsonToFormDataRecursive(jsonObject, formData, parentKey) {
  
  for (const key in jsonObject) {

    if (jsonObject.hasOwnProperty(key)) {
      var propName = parentKey || key;
      var value = jsonObject[key];
      if (parentKey && isJsonObject(jsonObject)) {
        propName = parentKey + '.' + key;
      }

      // console.log(key);
      if (value instanceof FileList) {
          for (var j = 0; j < value.length; j++) {
              formData.append(propName, value.item(j));
          }
      } else if (isArray(value) || isJsonObject(value)) {
        convertJsonToFormDataRecursive(value, formData, propName);
      } else if (value instanceof Blob) {
        formData.append(propName, value);
      } else if (value instanceof Date) {
        formData.append(propName, value.toISOString());
      } else if (((value === null) || value !== null) && value !== undefined) {
        formData.append(propName, value);
      }

    }
  }
  
  return formData;
}

export default function convertJsonToFormData(jsonObject) {
  let formData = new FormData();
  convertJsonToFormDataRecursive(jsonObject, formData);
  /*
  for (var pair of formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }
  */
  return formData;
}
