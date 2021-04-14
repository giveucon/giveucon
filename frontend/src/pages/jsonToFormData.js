export default function jsonToFormData(jsonData) {

  const formData = new FormData();
  for (const [jsonItemKey, jsonItemValue] of Object.entries(jsonData)) {
    if (typeof(jsonItemValue) === 'object') {
      if (Array.isArray(jsonItemValue) || (jsonItemValue.constructor.name === 'FileList')) {
        for (const arrayItem of jsonItemValue) {
          formData.append(jsonItemKey, arrayItem);
        }
      } else {
        throw new Error();
      }
    } else {
      formData.append(jsonItemKey, jsonItemValue);
    }
  }
  console.log(formData.entries());

  return formData;
}
