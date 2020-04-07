import { interfaces, controller, httpGet, httpPost, request, response, requestBody, httpPut, requestParam } from "inversify-express-utils";
import { inject } from 'inversify';
import { IResponseService } from "../services/response-service/iresponse.service";
import TYPES from "../config/types";
import * as express from 'express';
import { IConfigService } from "../config/iconfig.service";

@controller("")
export class HomeController implements interfaces.Controller {

    private _response: IResponseService;
    private _config: IConfigService;

    constructor(@inject(TYPES.IResponseService) response: IResponseService,
        @inject(TYPES.IConfigService) config: IConfigService) {
        this._config = config;
        this._response = response;
    }

    @httpGet("")
    public async getDirAllFiles(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            return res.render('pages/home', {
                title: 'Home',
                nodeEnv : this._config.env
            });

        } catch (error) {
            return this._response.BadRequest(res, error);
        }
    }

}