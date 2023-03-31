type SaveFileParams = {
  content: string;
  filename: string;

  /** Not really a path, its the folder hierarchy based on root path */
  folderPath: string;
};

type SaveFileResult = {
  ok: boolean;
  error?: Error;

  /** PathLike used to reach the final file. Can be a link, path, etc */
  fileReference?: string;
};

interface IFileService {
  saveFile(params: SaveFileParams): Promise<SaveFileResult>;
}

export { IFileService, SaveFileParams, SaveFileResult };
