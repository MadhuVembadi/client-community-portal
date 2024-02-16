const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

AWS.config.update({
    region: process.env.S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
 
const s3 = new AWS.S3();
 
async function uploadImage({imageName, imagePath}){
    console.log(imageName,imagePath);
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: imageName,
        Body: fs.createReadStream(imagePath)
    };
 
    return new Promise((resolve, reject)=>{
        s3.upload(params, (err, data) => {
            if (err) {
                reject(`Error uploading file: ${err}`)
            } else {
                resolve(data.Location)
            }
        });
    })
}
 
module.exports = {uploadImage}
 