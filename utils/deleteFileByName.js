import fs from "node:fs/promises";
import path from "node:path";

export const deleteFileByName = async (directoryPath, targetFileName) => {
    try {
        const files = await fs.readdir(directoryPath);
        const deletionPromises = files?.map(async file => {
            const baseFileName = path.parse(file)?.name;

            if (baseFileName === 'file' + targetFileName) {
                const filePath = path.join(directoryPath, file);
                await fs.unlink(filePath);
                console.log(`Successfully deleted ${filePath}`);
            }
        });
        await Promise.all(deletionPromises);
    } catch (error) {
        console.log("file delete error: ", error);

    }
};