import express from 'express';
import { IConsoleService } from '../services/console-service/iconsole.service';
import { inject, injectable } from 'inversify';
import TYPES from '../config/types';
import container from '../config/inversify.config';
@injectable()
export class ResReqMiddleware
{

    static init(app: express.Application)
    {
        app.use(this.wopi)
    }

    private  static wopi(req: express.Request, res: express.Response, next:any) {

        let ReqHeader = req.headers;
        const _consoleService = container.get<IConsoleService>(TYPES.IConsoleService);


        let consoleObj = {
            url : req.url,
            ReqHeader,
            resHeaders : res.getHeaders()
        }

        _consoleService.logs(["------------------------------------",req.method,req.host+consoleObj.url,consoleObj.resHeaders,consoleObj.ReqHeader]);

        // _consoleService.logs([
        //     '---------------request headers-----------------',
        //     'authorization=>'+ ReqHeader['authorization'],
        //     'x-request-id=>'+ ReqHeader['x-request-id'],
        //     'X-WOPI-SessionContext=>'+ ReqHeader['x-wopi-sessioncontext'],
        //     'X-WOPI-Override=>'+ ReqHeader['x-wopi-override'],
        //     'X-WOPI-Lock=>'+ ReqHeader['x-wopi-lock'],
        //     'X-WOPI-Editors=>'+ ReqHeader['x-wopi-editors'],
        //     'x-wopi-oldlock=>'+ ReqHeader['x-wopi-oldlock'],
        //     'X-WOPI-MaxExpectedSize=>'+ ReqHeader['X-WOPI-MaxExpectedSize']

        // ]);

        //console.log("req.headers");
        //console.log(req.headers);
        //console.log("res.headers");
        //console.log(res.header);
        next();
    }
}
