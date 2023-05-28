import { IncomingMessage, ServerResponse } from "http";
import { HttpStatusCodes, HeadersName, MimeTypes, RequestBase } from "./Index";
import * as fs from "fs";
import * as path from "path";
import {TextEncoder} from "util";
export class ResponseBase<T extends IncomingMessage> extends ServerResponse<T>{
    /**
     *
     */
    constructor(req: T) {
        super(req);

    }
    
    public Send(message: string, code: HttpStatusCodes): ResponseBase<T> {
        this.setHeader(HeadersName.ContentType, MimeTypes.PlainText);
        this.setHeader(HeadersName.ContentLength, message.length);
        this.writeHead(code).end(message);
        return this;
    }

    public SendSuccess(message: string): ResponseBase<T> {
        this.writeHead(HttpStatusCodes.OK).end(message);
        return this;
    }

    public Json(data: object, code: HttpStatusCodes): ResponseBase<T> {
        let serializedData = JSON.stringify(data);
        this.setHeader(HeadersName.ContentType, MimeTypes.ApplicationJson);
        this.setHeader(HeadersName.ContentLength, serializedData.length);
        this.writeHead(200).end(serializedData);
        return this;
    }

    public SendFile(filePath: string, cb: (error?: Error) => void): void {
        if (!fs.existsSync(filePath)){
            this.Send("File not found", HttpStatusCodes.NotFound);
        }

        //TODO: set headers mime type 
        //??
        let file = fs.readFileSync(filePath);
        let fileLength = file.byteLength;
        let fileName = path.basename(filePath);
        this.setHeader(HeadersName.ContentLength, fileLength);
        this.setHeader(HeadersName.ContentDisposition, `attachment; filename="${fileName.normalize()}"`);
        this.statusCode = 200;
        fs.createReadStream(filePath).pipe(this);
    }
}