import express from 'express';
import upload from '../config/upload.js';
import UploadVideoController from '../controllers/UploadVideo/index.controller.js';

const UploadRouter = express.Router({
    caseSensitive: true,
});

/** 
 * @method post  
 * @route /upload
 * @description Upload a video file
 * @returns {Object} JSON response with upload status
 * **/

UploadRouter
    .post('/upload', upload.single('file'), UploadVideoController.uploadVideo)

    /** 
     * @method get 
     * @route /videos
     * @description fetched all uploaded videos
     * @returns {Object} JSON response with upload status
     * **/

    .get("/videos", UploadVideoController.getAllVideos)

    /** 
    * @method get 
    * @route /videos/:lessonId
    * @description fetched single video by :lessonId
    * @params lessonId
    * @returns {Object} JSON response with upload status
    * **/

    .get("/videos/:lessonId", UploadVideoController.getVideoByLessonId)



    /** 
     * @method delete
     * @route /videos/:lessonId
     * @description delete single video by :lessonId
     * @params lessonId
     * @returns {Object} JSON response with upload status
     * **/

    .delete("/videos/:lessonId", UploadVideoController.delVideoByLessonId);



export default UploadRouter;