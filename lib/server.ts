import { deserializeFunc, serializeResult, FuncCall } from "./utils"

export class Server<T extends object> {
  implementation: T;
  constructor(implementation: T) {
    this.implementation = implementation;
  }
  async handle(arg: string) {
    const { name, args } = deserializeFunc(arg)
    const result = await (this.implementation as any)[name](...args);
    return serializeResult<T>({ name, result });
  }
}
