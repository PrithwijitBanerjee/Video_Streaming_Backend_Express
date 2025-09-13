import { addVideo, delVideoByLessonId, getAllVideos, getVideoByLessonId } from "./UploadVideo.services.js";

const UploadVideoServices = {
    addVideo,
    getAllVideos,
    getVideoByLessonId,
    delVideoByLessonId,
};

export default UploadVideoServices;