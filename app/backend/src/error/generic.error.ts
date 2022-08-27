class GenericError extends Error {
  private _code: number;
  private _name: string;

  constructor(message: string, code: number, name = 'GenericError') {
    super(message);
    this._code = code;
    this._name = name;
  }

  get code(): number {
    return this._code;
  }

  get name(): string {
    return this._name;
  }
}

export default GenericError;
