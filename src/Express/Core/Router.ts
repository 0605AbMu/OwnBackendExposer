import { Server } from "http";

import { Context, IMiddlewareBase, RequestBase, IRouter, TMiddleware, MethodTypes } from "./Index";

export class Router implements IRouter {

    private nextRouter: IRouter | null = null;
    routes: Map<string, Map<MethodTypes, TMiddleware[]>> = new Map<string, Map<MethodTypes, TMiddleware[]>>();

    middlewareTail: IMiddlewareBase | null = null;
    middlewareHead: IMiddlewareBase | null = null;
    /**
     * Middleware using
     * @param middleware Custom Middleware
    */
    public Use(middleware: IMiddlewareBase): void {
        if (this.middlewareTail === null) {
            this.middlewareHead = middleware;
            this.middlewareTail = this.middlewareHead;
        }
        else {
            this.middlewareTail.setNext(middleware);
            this.middlewareTail = middleware;
        }
    }

    async ExecuteAsync(context: Context): Promise<void> {
        let path = context.request.url?.toString() ?? "";
        if (!this.routes.has(path)) {
            await this.nextRouter?.ExecuteAsync(context);
        }
        let route = this.routes.get(path);
        let method = context.request.method?.toUpperCase() ?? null;
        if (method == null)
            throw new Error("Unknown method operation");
        if (!route?.has(MethodTypes[method as keyof typeof MethodTypes])) {
            throw new Error("Not found");
        }
        let middlewares = route?.get(MethodTypes[method as keyof typeof MethodTypes]);
        if (middlewares === undefined || middlewares.length === 0) {
            throw new Error("Not found");
        }
        //Middlewares chain execution
        this.MiddlewaresChainExecution(context, ...(<TMiddleware[]>middlewares));
    }

    ///Routing
    async PostAsync(path: string, ...params: TMiddleware[]) {
        this.SetRoute(path, MethodTypes.POST, ...params);
    }
    async PutAsync(path: string, ...params: TMiddleware[]) {
        this.SetRoute(path, MethodTypes.PUT, ...params);
    }
    async DeleteAsync(path: string, ...params: TMiddleware[]) {
        this.SetRoute(path, MethodTypes.DELETE, ...params)
    }
    async GetAsync(path: string, ...params: TMiddleware[]) {
        this.SetRoute(path, MethodTypes.GET, ...params);
    }

    private SetRoute(path: string, methodType: MethodTypes, ...params: TMiddleware[]) {

        if (!this.routes.has(path)) {
            this.routes.set(path, new Map<MethodTypes, TMiddleware[]>([
                [MethodTypes.GET, params]
            ]))
        } else {
            let route = this.routes.get(path);
            if (route?.has(methodType)) {
                route.get(methodType)?.push(...params);
            } else {
                route?.set(methodType, params);
            }
        }
    }

    //Set net router if that is exists
    SetNextRouter(nextRouter: IRouter): void {
        this.nextRouter = nextRouter;
    }

    // Middlewares chain execution
    private async MiddlewaresChainExecution(context: Context, ...params: TMiddleware[]): Promise<void> {
        //Bruth force solution for this problem
        return new Promise((res, rej) => {
            params.forEach(async (x) => {
                    await x(context);
                    if (context.response.writableEnded)
                        return res();
            });

            res();
        })
    }


}