const { os, path, fs } = require("./utils");

const mangaDir = path.join(os.homedir(), ".files-manager-thumbs", "mangas");
const videoDir = path.join(os.homedir(), ".files-manager-thumbs", "videos");

export const removeFile = async (file) => {
  try {
    await file.destroy();
    fs.removeSync(path.join(file.Path));
    const mangaCoverDir = path.join(mangaDir, file.DirName);
    const videoCoverDir = path.join(videoDir, file.DirName);

    let cover;
    //check if is video or manga
    if (fs.existsSync(mangaCoverDir)) {
      cover = mangaCoverDir;
    } else {
      cover = videoCoverDir;
    }
    //check if is a file
    if (!file.isDirectory) {
      cover = path.join(cover, file.FileName + ".jpg");
    } else {
      cover = path.join(cover, file.FileName);
    }

    if (fs.existsSync(cover)) {
      fs.removeSync(cover);
    }
  } catch (error) {
    console.log(error);
  }
};
