import { Response } from "express";
import { StatusCode } from "../../utils/enums/http-status-code.enum";
export interface IResponseService {
    Ok(res: Response, data? :any):any;
    BadRequest(res: Response, data? : any ):any;
    NotFound(res: Response ):any;
    UnprocessableEntity(res: Response, data? :any):any;
    Conflict(res: Response):any;
    SendStatusCode(res: Response, statusCode: StatusCode | number):any;
    ServerError(res: Response, data?: any):any;
}