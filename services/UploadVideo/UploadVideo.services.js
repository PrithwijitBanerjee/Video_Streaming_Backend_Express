import UploadVideoModel from "../../models/UploadVideo/UploadVideo.models.js";


export const addVideo = async ({ lessonId, videoUrl }) => {
    try {
        const videoDoc = new UploadVideoModel({
            lessonId,
            videoStreamUrl: videoUrl,
        });
        const videoData = await videoDoc.save();
        return videoData?._doc;
    } catch (error) {
        throw error;
    }
};

export const getAllVideos = async () => {
    try {
        const videos = await UploadVideoModel.find({});
        return videos;
    } catch (error) {
        throw error;
    }
};

export const getVideoByLessonId = async lessonId => {
    try {
        const video = await UploadVideoModel.findOne({
            lessonId,
        });
        return video?._doc;
    } catch (error) {
        throw error;
    }
};

export const delVideoByLessonId = async lessonId => {
    try {
        const video = await UploadVideoModel.findOneAndDelete({
            lessonId,
        });
        return video?._doc;
    } catch (error) {
        throw error;
    }
};