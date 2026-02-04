/* Certificate GENERATOR */


const { createCanvas, registerFont, loadImage } = require("canvas");
const fs = require("fs");
const imageDataURI = require("image-data-uri");
const logg = require("../utils/utils");
const UploadBucket = require("./bucket");

// const generateCertificate = async (data, cb) => {
//   if (data) {
//     await loadImage(data.imgUrl).then(async (image) => {
//       if (image) {
//         let fontPath = __dirname + '/PTSans-Regular.ttf'
//         // Creating Canvas
//         registerFont(fontPath, { family: 'PT Sans' })
//         const canvas = createCanvas(2409, 1861.5);
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(image, 0, 0, 2409, 1861.5);
//         //   For Student Name
//         ctx.font = "130px 'PT Sans', sans-serif";
//         ctx.fillStyle = "#2e2e2e";
//         ctx.textAlign = "center";
//         ctx.fillText(data.name, canvas.width / 2, canvas.height / 2.39);
//         //   For Certificate Number Label
//         ctx.font = "50px 'PT Sans', sans-serif";
//         ctx.fillStyle = "white";
//         ctx.fillText("Certification No.", 450, canvas.height - 140);
//         //   For Certificate Number
//         ctx.font = "70px 'PT Sans', sans-serif";
//         ctx.fillStyle = "white";
//         ctx.fillText(data.certNum, 450, canvas.height - 70);
//         //   Date Label
//         ctx.font = "50px 'PT Sans', sans-serif";
//         ctx.fillStyle = "white";
//         ctx.fillText("Date", canvas.width - 300, canvas.height - 140);
//         //   For Date
//         ctx.font = "70px 'PT Sans', sans-serif";
//         ctx.fillStyle = "white";
//         ctx.fillText(data.date, canvas.width - 300, canvas.height - 70);
//         //   Generating Data Url
//         const dataUrl = canvas.toDataURL();
//         //   Converting Data Url TO Image
//         if (fs.existsSync("tmp/")) {
//           await imageDataURI
//             .outputFile(dataUrl, `tmp/${data.certNum}.png`)
//             .then((res) => {
//               UploadBucket(res, data.certNum, (cert) => {
//                 cb(cert);
//               });
//             });
//         } else {
//           fs.mkdirSync("tmp/");
//           await imageDataURI
//             .outputFile(dataUrl, `tmp/${data.certNum}.png`)
//             .then((res) => {
//               UploadBucket(res, data.certNum, (cert) => {
//                 cb(cert);
//               });
//             });
//         }
//       }
//     });
//   }
// };
const generateCertificate = async (data, cb) => {
  if (data) {
    await loadImage(data.imgUrl).then(async (image) => {
      if (image) {
        let fontPath = __dirname + '/PTSans-Regular.ttf';
        // Creating Canvas
        registerFont(fontPath, { family: 'PT Sans' });
        const canvas = createCanvas(2409, 1861.5);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 2409, 1861.5);
        
        
       // For Student Name
ctx.font = "60px 'PT Sans', sans-serif"; // Decreased font size
ctx.fillStyle = "#2e2e2e";
ctx.textAlign = "left"; // Align to the left
const nameText = data.name.split(" "); // Split name into words
const totalNameHeight = nameText.length * 80; // Calculate total name height
ctx.fillText(data.name, 630, canvas.height / 1.68 ); // Adjusted position to left and lower

        // For institute name 
        ctx.font = "50px 'PT Sans', sans-serif"; // Decreased font size
        ctx.fillStyle = "#2e2e2e";
        ctx.textAlign = "left"; // Align to the left
        const nameTextInstitute = data.name.split(" "); // Split name into words
        const totalNameHeightInstitute = nameTextInstitute.length * 80; // Calculate total name height
        ctx.fillText(data.institute_name, 1450, canvas.height / 1.68); // Adjusted position to left and lower
        
        // For Certificate Number Label
        ctx.font = "50px 'PT Sans', sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Certification No.", 450, canvas.height - 140);
        
        // For Certificate Number
        // ctx.font = "70px 'PT Sans', sans-serif";
        // ctx.fillStyle = "white";
        // ctx.fillText(data.certNum, 450, canvas.height - 70);
        
        // Date Label
        // ctx.font = "50px 'PT Sans', sans-serif";
        // ctx.fillStyle = "black";
        // ctx.textAlign = "left"; // Align to the left
        // ctx.fillText("Date", canvas.width - 300, canvas.height - 140);
        
        // For Date
        ctx.font = "50px 'PT Sans', sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "left"; // Align to the left
        ctx.fillText(data.date, 120, canvas.height - 50);
        
        // Generating Data URL
        const dataUrl = canvas.toDataURL();
        
        // Converting Data URL TO Image
        if (fs.existsSync("tmp/")) {
          await imageDataURI
            .outputFile(dataUrl, `tmp/${data.certNum}.png`)
            .then((res) => {
              UploadBucket(res, data.certNum, (cert) => {
                cb(cert);
              });
            });
        } else {
          fs.mkdirSync("tmp/");
          await imageDataURI
            .outputFile(dataUrl, `tmp/${data.certNum}.png`)
            .then((res) => {
              UploadBucket(res, data.certNum, (cert) => {
                cb(cert);
              });
            });
        }
      }
    });
  }
};

// generateCertificate(certificateNum, certDate, image);
module.exports = generateCertificate;
