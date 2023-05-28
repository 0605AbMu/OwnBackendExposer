import {Context, TExecuteHandler, TExecuteHandlerAsync} from "./Index";
export interface IMiddlewareBase{
    Execute: TExecuteHandler;
    setNext(nextMiddleware: IMiddlewareBase):IMiddlewareBase;
    next(context: Context): void;
    nextAsync(context: Context): Promise<void>;
    ExecuteAsync: TExecuteHandlerAsync;
}