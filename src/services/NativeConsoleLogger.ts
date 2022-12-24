import { ILogService } from "../interfaces";

class NativeConsoleLogger implements ILogService {
  public log(data: any): void {
    console.dir(data, { depth: null });
  }

  public json(obj: object): void {
    console.log(JSON.stringify(obj, null, 2));
  }
}

export { NativeConsoleLogger };
