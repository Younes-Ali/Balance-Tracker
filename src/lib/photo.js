const MAX_CHARS = 40000;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image could not be read. Please choose another photo."));
    };
    img.src = url;
  });
}

export async function fileToDataUri(file, size = 128) {
  const img = await loadImage(file);
  const side = Math.min(img.width, img.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas
    .getContext("2d")
    .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
  let quality = 0.85;
  let uri = canvas.toDataURL("image/jpeg", quality);
  while (uri.length > MAX_CHARS && quality > 0.3) {
    quality -= 0.1;
    uri = canvas.toDataURL("image/jpeg", quality);
  }
  return uri;
}
