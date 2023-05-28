import { IncomingMessage } from "http";
import { Socket } from "net";
import {Form, FormOptions} from "multiparty";
export class RequestBase extends IncomingMessage {
    /**
     *
     */
    constructor(socket: Socket) {
        super(socket);

    }

    private _bodyBuffer: number[] = [];
    private _firstSerialized: boolean;
   
    public async BodyAsContent() : Promise<string>
    {
        return (await this.BodyAsBuffer()).toString();
    }

    public async BodyAsBuffer(): Promise<number[]>
    {
        let buffer = [];
        for await (const chunk of this) {
          buffer.push(chunk);
        }
        return buffer;
    }

    public async BodyAsJsonContentWithT<T>(): Promise<T>{
        let content = await this.BodyAsContent();
        return <T>JSON.parse(content)
    }
    public async BodyAsJsonContent(): Promise<object>{
        let content = await this.BodyAsContent();
        return JSON.parse(content)
    }
    public async BodyFromData(formOptions: FormOptions, cb: (err: Error, fields: any, files: any) => any)
    {
        var form = new Form(formOptions);
        form.parse(this, cb);
    }




}