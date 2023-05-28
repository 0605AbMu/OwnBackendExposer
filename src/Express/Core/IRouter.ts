import { Context, IMiddlewareBase, RequestBase, ResponseBase, TMiddleware } from "./Index";

export interface IRouter {
    Use(middleware: IMiddlewareBase): void;
    ExecuteAsync(context: Context): Promise<void>;
    GetAsync(path: string, ... params : TMiddleware[]): Promise<void>;
    PostAsync(path: string, ... params : TMiddleware[]): Promise<void>;
    PutAsync(path: string, ... params : TMiddleware[]): Promise<void>;
    DeleteAsync(path: string, ... params : TMiddleware[]): Promise<void>
    SetNextRouter(nextRouter: IRouter): void;
}