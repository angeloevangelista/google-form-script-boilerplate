// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ILogService {
  log(data: any): void;
  json(obj: object): void;
}

export { ILogService };
