# canvas 实现图片压缩

本文通过一个实例来练习 canvas，旨在提高 canvas 的熟练度。

这个实例要求压缩传入的图片，主要是通过将图片转化为 base64 编码，然后通过这个 base64 编码在 canvas 进行一系列的压缩，然后 canvas 会返回一个 base64 字符，渲染之后便是压缩后的图像。

## 实现代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" id="upload" />
    <script>
      const ACCEPT = ["image/jpg", "image/png", "image/jpeg"];
      const MAXSIZE = 1024 * 1024 * 10;
      const MAXSIZESTR = "10MB";
      const upload = document.getElementById("upload");

      function convertImageToBase64(file, callback) {
        let reader = new FileReader();
        reader.addEventListener("load", (e) => {
          const base64Image = e.target.result;
          callback && callback(base64Image);
          reader = null;
        });
        reader.readAsDataURL(file);
      }

      function compress(base64Image, callback) {
        let maxW = 1024;
        let maxH = 1024;
        const image = new Image();
        image.addEventListener("load", () => {
          let ratio;
          let needCompress = false;
          if (image.naturalWidth > maxW) {
            needCompress = true;
            ratio = image.naturalWidth / maxW;
            maxH = image.naturalHeight / ratio;
          }
          if (image.naturalHeight > maxH) {
            needCompress = true;
            ratio = image.naturalHeight / maxH;
            maxW = image.naturalWidth / ratio;
          }
          if (!needCompress) {
            maxW = image.naturalWidth;
            maxH = image.naturalHeight;
          }
          const canvas = document.createElement("canvas");
          canvas.width = maxW;
          canvas.height = maxH;
          canvas.style.visibility = "hidden";
          document.body.appendChild(canvas);

          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, maxW, maxH);
          ctx.drawImage(image, 0, 0, maxW, maxH);
          const compressImage = canvas.toDataURL("image/jpeg", 0.9);
          callback && callback(compressImage); // 发送给服务端
          const _image = new Image();
          _image.src = compressImage;
          document.body.append(_image);
          canvas.remove();
          console.log(
            `原图： ${image.src.length}，压缩后： ${_image.src.length}`
          );
          console.log(`压缩比: ${image.src.length / _image.src.length}`);
        });
        image.src = base64Image;
        document.body.append(image);
      }

      upload.addEventListener("change", function(e) {
        // console.log(e.target.files)
        const [file] = e.target.files;
        if (!file) return;
        const { type: fileType, size: fileSize } = file;

        if (ACCEPT.indexOf(fileType) < 0) {
          alert("不支持[" + fileType + "]文件类型!");
          upload.value = "";
          return;
        }

        if (fileSize > MAXSIZE) {
          alert(`文件超过${MAXSIZESTR}`);
          upload.value = "";
          return;
        }

        // 将 base64 传给服务器
        function uploadToServer(compressImage) {
          console.log("upload to server ......", compressImage);
        }

        // 压缩图片
        convertImageToBase64(file, (base64Image) => compress(base64Image));
      });
    </script>
  </body>
</html>
```
