import { getRandomString } from "../utils";
import { IFileService, SaveFileParams, SaveFileResult } from "../interfaces";

class GoogleScriptsFileService implements IFileService {
  async saveFile({
    content,
    filename,
    folderPath,
  }: SaveFileParams): Promise<SaveFileResult> {
    try {
      let [currentPathSegment, ...restOfFolderPathsSegments] = folderPath
        .split("/")
        .filter((p) => !!p);

      let currentPathAggregation = DriveApp.getRootFolder();

      while (
        restOfFolderPathsSegments.length !== 0 ||
        Boolean(currentPathSegment)
      ) {
        const currentFolderIterator =
          currentPathAggregation.getFoldersByName(currentPathSegment);

        currentPathAggregation = currentFolderIterator.hasNext()
          ? currentFolderIterator.next()
          : currentPathAggregation.createFolder(currentPathSegment);

        [currentPathSegment, ...restOfFolderPathsSegments] =
          restOfFolderPathsSegments;
      }

      const randomString = getRandomString();

      const createdFile = currentPathAggregation.createFile(
        `${randomString}-${filename}`,
        content
      );

      return {
        ok: true,
        error: undefined,
        fileReference: createdFile.getUrl(),
      };
    } catch (error) {
      return {
        ok: false,
        error: error as Error,
        fileReference: undefined,
      };
    }
  }
}

export { GoogleScriptsFileService };
