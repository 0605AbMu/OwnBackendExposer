import { Context, RequestBase, ResponseBase } from "./Index";

export type TMiddleware = (context: Context) => Promise<void>;