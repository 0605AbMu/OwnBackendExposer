import {MiddlewareBase, TExecuteHandler, TExecuteHandlerAsync} from "../Core/Index";

class FirstHandleMiddleware extends MiddlewareBase{
    public Execute: TExecuteHandler;
    public ExecuteAsync: TExecuteHandlerAsync;

}