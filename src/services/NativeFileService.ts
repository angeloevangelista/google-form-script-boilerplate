import fs from "fs";
import path from "path";
import { getRandomString } from "../utils";
import { IFileService, SaveFileParams, SaveFileResult } from "../interfaces";

class NativeFileService implements IFileService {
  async saveFile({
    content,
    filename,
    folderPath,
  }: SaveFileParams): Promise<SaveFileResult> {
    try {
      const baseFolderPath = path.resolve(__dirname, "..", "..", "debug");
      const completeFolderPath = path.join(baseFolderPath, folderPath);
      const randomString = getRandomString();

      const filePath = path.join(
        completeFolderPath,
        `${randomString}-${filename}`
      );

      if (!fs.existsSync(completeFolderPath)) {
        fs.mkdirSync(completeFolderPath, { recursive: true });
      }

      fs.writeFileSync(filePath, Buffer.from(content));

      return {
        ok: true,
        fileReference: filePath,
        error: undefined,
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

export { NativeFileService };
