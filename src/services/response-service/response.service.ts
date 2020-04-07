import { Response } from "express";
import { IResponseService } from "./iresponse.service";
import { injectable } from "inversify";
import { StatusCode } from "../../utils/enums/http-status-code.enum";


@injectable()
class ResponseService implements IResponseService {

    private resData: any = { status: false };

    Ok(res: Response, data?: object) {
        res.statusCode = StatusCode.Ok;
        this.resData.status = true;
        if (data) {
            this.resData["data"] = data;
        }
        return res.json(this.resData);
    }

    BadRequest(res: Response, data?: any):any {
        res.statusCode = StatusCode.BadRequest;
        this.resData.status = false;
        if (data) {
            this.resData["error"] = data;
        }
        return res.json(this.resData);
    }

    ServerError(res: Response, data?: any):any {
        res.statusCode = StatusCode.ServerError;
        this.resData.status = false;
        if (data) {
            this.resData["error"] = data;
        }
        return res.json(this.resData);
    }

    NotFound(res: Response) {
        res.statusCode = StatusCode.NotFound;
        this.resData.status = false;
        this.resData["error"] = "not found.";
        return res.json(this.resData);
    }

    UnprocessableEntity(res: Response, data? :any){
        res.statusCode = StatusCode.UnprocessableEntity;
        this.resData.status = false;
        if (data) {
            this.resData["error"] = data;
        }
        return res.json(this.resData);
    }

    Conflict(res: Response){
        res.statusCode = StatusCode.Conflict;
        return res.send();
    }

    SendStatusCode(res: Response, statusCode: StatusCode | number){
        return res.sendStatus(statusCode)
    }
}

export default ResponseService;


