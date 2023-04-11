const Jimp = require('jimp');
const fs = require('fs');

async function addWatermark(inputFile, outputFile) {
  // Read the input image
  const image = await Jimp.read(inputFile);
  const font = await Jimp.loadFont('./font.fnt');
  
  ///Add custom text to old watermark//
  const new_watermark = ""  ///////////
  /////////////////////////////////////

  image.clone((err, watermark) => {
    if (err) throw err;

    // Crop the cloned image to the desired size
    watermark.crop(
      image.bitmap.width - 83,
      image.bitmap.height - 36,
      83,
      18
    );

    watermark.blur(5);

    // Overlay the watermark image in the bottom right corner of the original image
    image.composite(watermark, image.bitmap.width - 83, image.bitmap.height - 18, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1
    });

    
    image.print(font, Number(image.bitmap.width - 50), Number(image.bitmap.height - 30), new_watermark);


    // Save the watermarked image
    image.write(outputFile);
  });
}

function addWatermarkToImages(dir, outputDir, numFiles) {
  fs.readdir(dir, (err, files) => {
    // This is the callback function for fs.readdir
    if (err) throw err;

    let count = 0

    files.forEach(file => {
      const inputFile = `${dir}/${file}`;
      // Generate a random number from 0 to numFiles - 1
      const name = count += 1;
      const outputFile = `${outputDir}/${name}.png`;

      fs.stat(inputFile, (err, stat) => {
        // This is the callback function for fs.stat
        if (err) throw err;

        if (stat.isDirectory()) {
          addWatermarkToImages(inputFile, outputFile, numFiles);
        } else {
          addWatermark(inputFile, outputFile);
        }
      });
    });
  });
}

// Add a watermark to all images in the input directory and save the watermarked images to the output directory
const inputDir = './input';
const outputDir = './output';

fs.readdir(inputDir, (err, files) => {
  // This is the callback function for fs.readdir
  if (err) throw err;

  // Get the number of files in the input directory
  const numFiles = files.length;
  process.stdout.write("Adding watermarks...")
  addWatermarkToImages(inputDir, outputDir, numFiles);
});
