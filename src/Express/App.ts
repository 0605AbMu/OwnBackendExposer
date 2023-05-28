import { IncomingMessage, Server, ServerResponse } from "http";
import {Context, IRouter, RequestBase, ResponseBase, Router} from "./Core/Index";


export default class App extends Server {
    routers: Map<string, Router> = new Map<string, Router>();
    /**
     *
     */
    constructor() {
    super({
        IncomingMessage: RequestBase,
        ServerResponse: ResponseBase
    })
        
    }
    Initialize(){
        this.addListener("error", err => {
            this.logErr(err);
        })
        this.addListener("request", async (req, res) => {
            let context = new Context();
            context.request = <RequestBase>req;
            context.response = <ResponseBase<RequestBase>>res;
            this.routers.forEach(async x => {
                try {
                    await x.ExecuteAsync(context);
                } catch (error: any) {

                    this.logErr((<Error>error))
                }
            });
            this.log(context);
        });
    }

    Use(path: string, router: Router)
    {
        this.routers.set(path, router);
    }

    private log(context: Context){
        console.log(`${new Date().toUTCString()}|${context.request.method} - ${context.request.url} | Return ${context.response.statusCode} && ${context.response.statusMessage}`);
    }
    private logErr(err:Error){
        console.log(`${new Date().toUTCString()}|${err.message}`);
    }
}