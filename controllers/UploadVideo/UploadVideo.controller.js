import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import { exec } from "child_process";
import { stderr, stdout } from "process";
import createError from "http-errors";
import AllStatusCodes from "../../utils/AllStatusCodes.js";
import appConfig from "../../config/config.js";
import { successResponse } from "../../utils/responseHandler.js";
import UploadVideoServices from "../../services/UploadVideo/index.services.js";
import { deleteFileByName } from "../../utils/deleteFileByName.js";
import ffmpeg from "fluent-ffmpeg";

export const uploadVideo = (req, res, next) => {
    // const lessonId = uuidv4();
    const lessonId = req.file.filename.replace('file', '').replace(path.extname(req.file.filename), '');
    const videoPath = req.file.path;

    // Fix the output path - use absolute path
    const outputPath = path.join(process.cwd(), "uploads", "courses", lessonId);
    const hlsPath = `${outputPath}/index.m3u8`;
    // console.log("hlsPath: ", hlsPath);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, {
            recursive: true,
        });
    }
    // ffmpeg
    // const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    // no queue because of POC, not to be used in production
    // exec(ffmpegCommand, async (error, stdout, stderr) => {
    //     try {
    //         if (error) {
    //             console.log(`exec error: ${error}`);
    //             return next(createError(AllStatusCodes.InternalServerError, error));
    //         }
    //         // console.log("stdout: ", stdout);
    //         // console.log("stderr: ", stderr);
    //         const videoUrl = `http://localhost:${appConfig.app.port}/uploads/courses/${lessonId}/index.m3u8`;
    //         const videoData = await UploadVideoServices.addVideo({
    //             lessonId,
    //             videoUrl,
    //         });
    //         if (!videoData) {
    //             return next(createError(AllStatusCodes.BadRequest, "can not able to upload video!!!"));
    //         }
    //         successResponse(res, {
    //             status: 200,
    //             message: "Video converted to HLS format",
    //             payload: {
    //                 // videoUrl,
    //                 ...videoData,
    //             },
    //         });

    //     } catch (error) {
    //         next(createError(AllStatusCodes.InternalServerError, error?.message));
    //     }
    // });

    // Use fluent-ffmpeg instead of exec command
    ffmpeg(videoPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .addOption('-hls_time', '10')
        .addOption('-hls_playlist_type', 'vod')
        .addOption('-hls_segment_filename', `${outputPath}/segment%03d.ts`)
        .addOption('-start_number', '0')
        .output(hlsPath)
        .on('start', (commandLine) => {
            console.log('FFmpeg process started:', commandLine);
        })
        .on('progress', (progress) => {
            // Handle different progress object structures
            let progressInfo = '';

            if (progress.percent !== undefined) {
                progressInfo = `Processing: ${progress.percent.toFixed(2)}% done`;
            } else if (progress.timemark) {
                progressInfo = `Processing: Current timestamp - ${progress.timemark}`;
            } else if (progress.frames) {
                progressInfo = `Processing: ${progress.frames} frames processed`;
            } else {
                progressInfo = 'Processing in progress...';
            }
            console.log(progressInfo);
        })
        .on('end', async () => {
            try {
                console.log('FFmpeg processing finished successfully');
                const videoUrl = `http://localhost:${appConfig.app.port}/uploads/courses/${lessonId}/index.m3u8`;
                const videoData = await UploadVideoServices.addVideo({
                    lessonId,
                    videoUrl,
                });

                if (!videoData) {
                    return next(createError(AllStatusCodes.BadRequest, "can not able to upload video!!!"));
                }

                successResponse(res, {
                    status: 200,
                    message: "Video converted to HLS format",
                    payload: {
                        ...videoData,
                    },
                });
            } catch (error) {
                next(createError(AllStatusCodes.InternalServerError, error?.message));
            }
        })
        .on('error', (error) => {
            console.log('FFmpeg error:', error);
            return next(createError(AllStatusCodes.InternalServerError, error.message));
        })
        .run();
};

export const getAllVideos = async (_, res, next) => {
    try {
        const videos = await UploadVideoServices.getAllVideos();
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: 'Video list has been fetched successfully',
            payload: {
                videos,
            },
        });
    } catch (error) {
        next(createError(AllStatusCodes.InternalServerError, error?.message));
    }
};

export const getVideoByLessonId = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const video = await UploadVideoServices.getVideoByLessonId(lessonId);
        if (!video) {
            return next(createError(AllStatusCodes.NotFound, `video of lessonId: ${lessonId} does not exist!!!`));
        }
        successResponse(res, {
            status: AllStatusCodes.OK,
            message: `video of lessonId: ${lessonId} has been fetched successfully`,
            payload: {
                ...video,
            },
        });
    } catch (error) {
        next(createError(AllStatusCodes.InternalServerError, error?.message));
    }
};




export const delVideoByLessonId = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const video = await UploadVideoServices.delVideoByLessonId(lessonId);
        if (!video) {
            return next(createError(AllStatusCodes.NotFound, `Deletion Failed!!!, video of lessonId: ${lessonId} does not exist!!!`));
        }
        // Delete the folder and its contents
        const videoFolderPath = path.join(process.cwd(), "uploads", "courses", lessonId);

        if (fs.existsSync(videoFolderPath)) {
            // Delete all files in the folder first
            fs.readdirSync(videoFolderPath).forEach(file => {
                fs.unlinkSync(path.join(videoFolderPath, file));
            });
            // Then delete the folder itself
            fs.rmdirSync(videoFolderPath);
        }

        // Then delete all video files outside courses folder ...
        await deleteFileByName(`${process.cwd()}/uploads/`, lessonId);

        successResponse(res, {
            status: AllStatusCodes.OK,
            message: `video of lessonId: ${lessonId} has been deleted successfully`,
            payload: {
                ...video,
            },
        });
    } catch (error) {
        next(createError(AllStatusCodes.InternalServerError, error?.message));
    }
};