import { IEncodingService } from "../interfaces";

class NativeEncodingService implements IEncodingService {
  toBase64(payload: string) {
    return Buffer.from(payload).toString("base64")
  }
}

export { NativeEncodingService }
