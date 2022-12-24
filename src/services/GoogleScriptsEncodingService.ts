import { IEncodingService, ILogService } from "../interfaces";

class GoogleScriptsEncodingService implements IEncodingService {
  toBase64(payload: string) {
    return Utilities.base64Encode(payload);
  }
}

export { GoogleScriptsEncodingService };
