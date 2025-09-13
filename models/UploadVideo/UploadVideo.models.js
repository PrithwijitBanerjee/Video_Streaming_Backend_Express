import mongoose from "mongoose";


const uploadVideoSchema = new mongoose.Schema({
    lessonId: {
        type: String,
        required: [true, "Lesson Id is required!!!"],
    },
    videoStreamUrl: {
        type: String,
        required: [true, "Video Stream URL is required!!!"],
    }
}, {
    virtuals: false,
});


const UploadVideoModel = new mongoose.model("Video", uploadVideoSchema);

export default UploadVideoModel;