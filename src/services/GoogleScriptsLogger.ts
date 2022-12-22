import { ILogService } from "../interfaces";

class GoogleScriptsLogger implements ILogService {
  public log(data: any): void {
    Logger.log("GoogleScriptsLogger");
    Logger.log(data);
  }

  public json(obj: object): void {
    Logger.log(JSON.stringify(obj, null, 2));
  }
}

export { GoogleScriptsLogger };
