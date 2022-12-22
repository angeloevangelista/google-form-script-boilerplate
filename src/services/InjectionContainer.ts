type Constructable<T = any> = new (...args: any[]) => T;

type RegisterOutput<ServiceTokenDefinition> = {
  register: <T>(
    token: ServiceTokenDefinition,
    service: Constructable<T>
  ) => RegisterOutput<ServiceTokenDefinition>;
};

class InjectionContainer<ServiceTokenDefinition> {
  private _services: Map<string, Constructable> = new Map();

  public register<T>(
    token: ServiceTokenDefinition,
    service: Constructable<T>
  ): RegisterOutput<ServiceTokenDefinition> {
    const tokenKey = String(token);

    this._services.set(tokenKey, service);

    return {
      register: this.register.bind(this),
    };
  }

  public get<T>(token: ServiceTokenDefinition, ...params: any[]): T {
    const tokenKey = String(token);

    if (!this._services.has(tokenKey)) {
      throw new Error(`Service ${tokenKey} not registered`);
    }

    const service = this._services.get(tokenKey) as Constructable<T>;

    return new service(...params);
  }
}

export { InjectionContainer };
