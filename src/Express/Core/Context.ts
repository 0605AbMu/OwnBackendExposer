import {RequestBase, ResponseBase} from "./Index";
export class Context {
    request: RequestBase;
    response: ResponseBase<RequestBase>;
}