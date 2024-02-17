import { parse } from "./parser";
import { stringify } from "./stringifier";

export class QueryString {
  private readonly _raw: Object;

  constructor(params: URLSearchParams | Object | string) {
    if (params instanceof String) {
      this._raw = parse(params as string);
      return;
    }

    // recoginise as URLSearch Params if it has following methods
    if (
      (params as URLSearchParams).forEach &&
      (params as URLSearchParams).entries &&
      (params as URLSearchParams).toString
    ) {
      this._raw = parse(decodeURI(params.toString()));
      return;
    }

    this._raw = params;
  }

  get object() {
    return this._raw;
  }

  toString() {
    return stringify(this._raw);
  }
}
