type Constructable<T = any> = new (...args: any[]) => T;

type RegisterOutput<ServiceTokenDefinition> = {
  register: <T>(
    token: ServiceTokenDefinition,
    service: Constructable<T>
  ) => RegisterOutput<ServiceTokenDefinition>;
};

class InjectionContainer<ServiceTokenDefinition> {
  private _services: Map<ServiceTokenDefinition, Constructable> = new Map();

  public register<T>(
    token: ServiceTokenDefinition,
    service: Constructable<T>
  ): RegisterOutput<ServiceTokenDefinition> {
    this._services.set(token, service);

    return {
      register: this.register.bind(this),
    };
  }

  /**
   *
   * @param token The tokenService to provide
   * @returns An instance of the service, if already registered,
   *          and provides it the current instance of the InjectionContainer
   *          as first argument of the constructor
   */
  public get<T/*, ParamsType = never*/>(
    token: ServiceTokenDefinition,
    // params?: ParamsType,
  ): T {
    if (!this._services.has(token)) {
      throw new Error(`Service ${token} not registered`);
    }

    const ServiceConstructor = this._services.get(token) as Constructable<T>;

    return new ServiceConstructor(this);
  }
}

export { InjectionContainer };
