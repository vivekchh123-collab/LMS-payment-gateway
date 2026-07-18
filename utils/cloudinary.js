import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({})

//check and load variable

cloudinary.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
    try {
        await cloudinary.uploader.update(file,{
            resource_type:"auto"
        })
        return uploadResponse
    } catch (error) {
       console.log("error in uploading media to cloudinary");
       console.log(error);  
    }
}

export const deleteMediaFromCloudiary = async (publicId) => {
    try {
        await cloudinary,uploader.destroy(publicId, {resource_type: "video"})
    } catch (error) {
        console.log("Faiiled  to delete MEDIA from cloudinary");
        console.log(error); 
    }
}