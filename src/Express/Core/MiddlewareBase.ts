import {Context, IMiddlewareBase} from "./Index";

export abstract class MiddlewareBase implements IMiddlewareBase {
    public nextMiddleware: IMiddlewareBase;
    setNext(nextMiddleware: IMiddlewareBase) {
        this.nextMiddleware = nextMiddleware;
        return this;
    }
    next(context: Context) {
        this.nextMiddleware.Execute(context);
    }
    async nextAsync(context: Context): Promise<void> {
        this.nextMiddleware.Execute(context);
    }
    public abstract Execute: TExecuteHandler;

    public abstract ExecuteAsync: TExecuteHandlerAsync;
}

export type TExecuteHandler = (context: Context) => void;
export type TExecuteHandlerAsync = (context: Context) => Promise<void>;