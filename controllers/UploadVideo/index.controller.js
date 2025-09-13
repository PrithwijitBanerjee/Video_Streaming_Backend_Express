import { delVideoByLessonId, getAllVideos, getVideoByLessonId, uploadVideo } from "./UploadVideo.controller.js";

const UploadVideoController = {
    uploadVideo,
    getAllVideos,
    getVideoByLessonId,
    delVideoByLessonId,
};

export default UploadVideoController;