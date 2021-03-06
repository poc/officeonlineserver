import * as express from 'express';
import { interfaces, controller, httpGet, httpPost, request, response, requestParam } from "inversify-express-utils";
import { inject } from 'inversify';
import TYPES from '../../config/types';
import { IResponseService } from '../../services/response-service/iresponse.service';
import { IWopiFileService } from '../../services/wopi-file-service/iwopi-file.service';
import { File } from '../../entity/file';
import { ApiPath, ApiOperationGet, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { StatusCode } from '../../utils/enums/http-status-code.enum';
import { IConfigService } from '../../config/iconfig.service';
import { WOPIHeaders } from '../../utils/constants/wopi-headers.constants';
import { v1 as uuidv1 } from 'uuid';
@ApiPath({
    path: "/wopi",
    name: "Wopi Host",
    security: { apiKeyHeader: ['authorization'] }
})

@controller("/wopi")
export class WopiController implements interfaces.Controller {

    private _wopiFileService: IWopiFileService;
    private _response: IResponseService
    private _config: IConfigService

    constructor(@inject(TYPES.IResponseService) response: IResponseService,
        @inject(TYPES.IWopiFileService) wopiFileService: IWopiFileService,
        @inject(TYPES.IConfigService) config: IConfigService) {
        this._response = response;
        this._wopiFileService = wopiFileService;
        this._config = config;
    }

    @ApiOperationGet({
        path: 'files/{fileId}',
        description: "Used by wopi host server to maintain the file's actions",
        summary: "This is get request return check file info response for wopi host server",
        parameters: {
            path: {
                fileId: {
                    required: true
                }
            },
        },
        responses: {
            200: { description: "Success", type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "CheckFileResponseModel" }
        }
    })

    /**
     * check file and return information of file to wopi server
     * @param id 
     * @param req 
     * @param res 
     */
    @httpGet("/files/:fileId")
    public async checkFileInfo(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            let token = req.headers['authorization'];
            token = token ? token : this._config.emptyStr;
            let fileInfo = await this._wopiFileService.checkFileInfo(fileId, token);
            let version = uuidv1();
            let getFile: File = await this._wopiFileService.getFileInfobyId(fileId);
            if (!getFile) {
                let file: File = new File();
                file.FileId = fileId;
                file.XWopiItemVersion = version;
                fileInfo.Version = version;
                this._wopiFileService.saveFileInfo(file);
            }
            else {
                fileInfo.Version = getFile.XWopiItemVersion;
                fileInfo.UserInfo = getFile.UserInfo
            }
            return res.json(fileInfo);
        } catch (error) {
            this.returnErrorResponse(res, error);
        }
    }

    @ApiOperationGet({
        path: 'files/{fileId}/contents',
        description: "Get request to get files binary by wobi host server (client)",
        summary: "Get request to get files binary by wobi host server (client)",
        parameters: {
            path: {
                fileId: {
                    required: true
                }
            },
        },
        responses: {
            200: { description: "Success", type: SwaggerDefinitionConstant.Response.Type.ARRAY }
        }
    })

    /**
     * use by wopi host to get file
     * @param fileId 
     * @param req 
     * @param res 
     */
    @httpGet("/files/:fileId/contents")
    public async getFileContents(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            let token = req.headers['authorization'];
            token = token ? token : this._config.emptyStr;
            let isTempFileExist = await this._wopiFileService.isTempFileExist(fileId);
            let stream: Buffer;
            if (isTempFileExist) {
                stream = await this._wopiFileService.readTempFile(fileId, "");
            }
            else {
                stream = await this._wopiFileService.getFileBytes(fileId, token);
                await this._wopiFileService.puttempFile(fileId, stream);
            }
            console.log(`[Get File Content Size]=>  ${stream.length}  [offset]=> ${stream.byteOffset}`);
            await this.setItemVersionHeader(res, fileId);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(stream);
        } catch (error) {
            return this.returnErrorResponse(res, error);
        }
    }

    @httpGet("/files/:fileId/save")
    public async saveFileContent(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            let token = req.headers['authorization'];
            let data = await this._wopiFileService.readTempFile(fileId);
            let isUpadate = await this._wopiFileService.updateFileBytes(fileId, data, token);
            if (isUpadate) {
                await this._wopiFileService.deleteFile(fileId);
                this._wopiFileService.deleteTempFile(fileId);
            }
            this._response.Ok(res, { mes: "file is updated/saved" });
        } catch (error) {
            return this.returnErrorResponse(res, error);
        }
    }

    @httpGet("/files/:fileId/close")
    public async closeFileContent(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            await this._wopiFileService.deleteFile(fileId);
            this._wopiFileService.deleteTempFile(fileId);
            return this._response.Ok(res, { mes: "file is closed" });
        } catch (error) {
            return this.returnErrorResponse(res, error);
        }
    }

    /**
     * use by wopi host to update file , [PutFile] operation updates a file’s binary contents
     * @param id 
     * @param req 
     * @param res 
     */
    @httpPost("/files/:fileId/contents")
    public async postContent(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            let resp = await this.handlePutFile(req, res, fileId);
            return resp;
        } catch (error) {
            return this.returnErrorResponse(res, error);
        }
    }

    /**
     * use by wopi host to modify permission on file , like lock and unlock file for edit mode.
     * @param id 
     * @param req 
     * @param res 
     */
    @httpPost("/files/:fileId")
    public async fileAction(@requestParam("fileId") fileId: string, @request() req: express.Request, @response() res: express.Response) {
        try {
            let xWopiOverride = req.headers[WOPIHeaders.XWopiOverride];
            let xWopiOldLock = req.headers[WOPIHeaders.XWopiOldLock];
            let resp: any;
            switch (xWopiOverride) {
                case 'LOCK': {
                    if (xWopiOldLock) {
                        resp = await this.handleUnlockRelock(req, res, fileId);
                    }
                    else {
                        resp = await this.handleLock(req, res, fileId);
                    }
                    break;
                }
                case 'REFRESH_LOCK': {
                    resp = await this.handleRefreshLock(req, res, fileId);
                    break;
                }
                case 'GET_LOCK': {
                    resp = await this.handleGetLock(res, fileId);
                    break;
                }
                case 'UNLOCK': {
                    resp = await this.handleUnlock(req, res, fileId);
                    break;
                }

                case 'PUT': {
                    resp = await this.handlePutFile(req, res, fileId);
                    break;
                }
                case 'PUT_RELATIVE': {
                    return res.sendStatus(200);
                }

                case 'PUT_USER_INFO': {
                    resp = await this.handleUserInfo(req, res, fileId);
                    break;
                }
            }
            console.log(xWopiOverride + " " + res.statusCode);
            return resp;
        } catch (error) {
            return this.returnErrorResponse(res, error);
        }
    }

    /***
     * private methods
     */
    private async handleUserInfo(req: any, res: any, fileId: any) {
        let data = await this.readReqBuffer(req);
        let userInfo = data.toString();
        let getFile: File = await this._wopiFileService.getFileInfobyId(fileId);
        getFile.UserInfo = userInfo;
        await this._wopiFileService.updateFile(getFile);
        return this._response.SendStatusCode(res, StatusCode.Ok);
    }

    private async handleLock(req: any, res: any, fileId: any) {
        let newLock = req.headers[WOPIHeaders.XWopiLock];
        let existingLock = await this.getExistingLock(fileId);
        let fileLocked = this.isFileLocked(existingLock);
        this.LogHeader();
        if (fileLocked) {
            if (existingLock.Lock === newLock) {
                await this.updateLockInfo(fileId, newLock);  //refresh the lock
                //return this._response.SendStatusCode(res, StatusCode.Ok);
            }
            else if (!this.isXWopiValidLength(newLock)) {   //!this.isXWopiValidFormat(newLock) || 
                return await this.returnInvalidLock(res);
            }
            else {
                return await this.returnMismatch(res, existingLock.Lock, 'new lock not matched with current lock on file, file locked.');
            }
        }
        else {
            await this.updateLockInfo(fileId, newLock);  //lock the file
        }

        if (!this.isXWopiValidLength(newLock))  //!this.isXWopiValidFormat(newLock) || 
            return await this.returnInvalidLock(res);

        await this.setItemVersionHeader(res, fileId);
        return this._response.SendStatusCode(res, StatusCode.Ok)  // return ok

    }

    private async handleUnlock(req: any, res: any, fileId: any) {
        let newLock = req.headers[WOPIHeaders.XWopiLock];
        let existingLock = await this.getExistingLock(fileId);
        let fileLocked = this.isFileLocked(existingLock);
        this.LogHeader();
        if (fileLocked) {
            if (existingLock.Lock === newLock) {
                await this.updateLockInfo(fileId, null);
                await this.setItemVersionHeader(res, fileId);
                return this._response.SendStatusCode(res, StatusCode.Ok);
            }
            else if (!this.isXWopiValidLength(newLock)) {
                return await this.returnInvalidLock(res);
            }
            else {
                return await this.returnMismatch(res, existingLock.Lock, 'new lock not matched with current lock on file');
            }
        }
        else {
            if (!this.isXWopiValidLength(newLock)) {
                return await this.returnInvalidLock(res);
            }
            // else if (!this.isXWopiValidFormat(newLock)) {
            //     return await this.returnInvalidLock(res, newLock);
            // }
            return await this.returnMismatch(res, null, 'File not locked');
        }
    }

    private async setItemVersionHeader(res: any, fileId: any, version?: string) {
        version = version ?? await this.getFileItemVersion(fileId);
        res.setHeader(WOPIHeaders.XWopiVersion, version);
    }

    private async handlePutFile(req: any, res: any, fileId: any) {
        let newLock = req.headers[WOPIHeaders.XWopiLock];
        let existingLock = await this.getExistingLock(fileId);
        let fileLocked = this.isFileLocked(existingLock);
        this.LogHeader();
        let isFileExist = await this._wopiFileService.isTempFileExist(fileId);
        if (!isFileExist) {
            return this._response.SendStatusCode(res, StatusCode.NotFound);
        }
        let fileInfo = this._wopiFileService.getTempFileDetail(fileId);
        if (!fileLocked && fileInfo.size !== 0) {
            return await this.returnMismatch(res, null, 'PutFile on unlocked file with current size != 0');
        }

        if (fileLocked && existingLock.Lock !== newLock) {
            return await this.returnMismatch(res, existingLock.Lock, 'new lock not matched with current lock on file- put file');
        }
        else if (!this.isXWopiValidLength(newLock)) {
            return await this.returnInvalidLock(res);
        }
        else {
            await this.updateFileBinaryContent(req, fileId);
            let version = uuidv1();
            await this.setItemVersionHeader(res, fileId, version);
            return this._response.SendStatusCode(res, StatusCode.Ok);
        }
    }

    private async updateFileBinaryContent(req: any, fileId: any) {
        let data: Buffer = await this.readReqBuffer(req);
        if (data) {
            console.log("file update size " + data.length);
            await this._wopiFileService.puttempFile(fileId, data);
            return true;
        }
        return false;
    }

    private async readReqBuffer(req: any): Promise<any> {
        let chunks: any = [];
        return await new Promise((res) => {
            req.on('data', function (chunk: any) {
                chunks.push(chunk)
            });
            req.on('end', async function () {
                chunks = Buffer.concat(chunks);
                res(chunks);
            });
        });
    }

    private async handleRefreshLock(req: any, res: any, fileId: any) {
        let newLock = req.headers[WOPIHeaders.XWopiLock];
        let existingLock = await this.getExistingLock(fileId);
        let fileLocked = this.isFileLocked(existingLock);
        this.LogHeader();
        if (fileLocked) {
            if (existingLock.Lock !== newLock) {
                return await this.returnMismatch(res, existingLock.Lock, 'file lock mismatch on refresh lock, file locked')
            }
        }
        else {
            if (existingLock.Lock !== newLock) {
                return await this.returnMismatch(res, null, 'file mismatch on refresh lock, file unlocked')
            }
        }
        await this.updateLockInfo(fileId, newLock);
        return this._response.SendStatusCode(res, StatusCode.Ok);
    }

    private async handleUnlockRelock(req: any, res: any, fileId: any) {
        let newLock = req.headers[WOPIHeaders.XWopiLock];
        let oldLock = req.headers[WOPIHeaders.XWopiOldLock];
        let existingLock = await this.getExistingLock(fileId);
        let fileLocked = this.isFileLocked(existingLock);
        this.LogHeader();
        if (fileLocked) {
            if (existingLock.Lock === oldLock) {
                await this.updateLockInfo(fileId, newLock);
                return this._response.SendStatusCode(res, StatusCode.Ok)
            }
            else if (!this.isXWopiValidLength(newLock)) {
                return await this.returnInvalidLock(res);
            }
            else {
                return await this.returnMismatch(res, existingLock.Lock, 'old lock not match the exiting lock on Locked file');
            }
        }
        else {
            if (!this.isXWopiValidLength(newLock)) {   //!this.isXWopiValidFormat(newLock) || 
                return await this.returnInvalidLock(res);
            }
            return await this.returnMismatch(res, undefined, 'file not locked');
        }
    }

    private async handleGetLock(res: any, fileId: any) {
        let existingLock = await this.getExistingLock(fileId);
        let fileLocked = this.isFileLocked(existingLock);
        this.LogHeader();
        if (fileLocked) {
            res.set(WOPIHeaders.XWopiLock, existingLock.Lock);
            return this._response.SendStatusCode(res, StatusCode.Ok);
        }
        else {
            res.set(WOPIHeaders.XWopiLock, this._config.emptyStr);
            return this._response.SendStatusCode(res, StatusCode.Ok);
        }
    }

    private async getExistingLock(fileId: any) {
        let file: File = await this._wopiFileService.getFileInfobyId(fileId);
        let expired = true;
        let date = file.LockCreatedDate;
        if (file.XWopiLock) {
            let expTime = new Date(date.getTime() + 30 * 60000)
            expired = expTime < new Date();
        }
        return {
            Lock: file.XWopiLock,
            CreatedDate: Date.now(),
            Expired: expired
        };
    }

    private async updateLockInfo(fileId: any, newLock: any) {
        let file: File = await this._wopiFileService.getFileInfobyId(fileId);
        file.XWopiLock = newLock;
        file.LockCreatedDate = new Date();
        await this._wopiFileService.updateFile(file);
    }


    private async returnMismatch(res: any, existingLock: any = undefined, reason: any = undefined) {
        res.set(WOPIHeaders.XWopiLock, existingLock ?? this._config.emptyStr);
        if (reason) {
            res.set(WOPIHeaders.XWopiLockFailureReason, reason);
        }
        return this._response.SendStatusCode(res, StatusCode.Conflict);
    }

    private async returnInvalidLock(res: any, existingLock: any = undefined, reason: any = undefined) {
        res.set(WOPIHeaders.XWopiLock, existingLock ?? this._config.emptyStr);
        if (reason) {
            res.set(WOPIHeaders.XWopiLockFailureReason, reason);
        }
        return this._response.SendStatusCode(res, existingLock ? StatusCode.Conflict : StatusCode.Ok);
    }

    private async getFileItemVersion(fileId: any) {
        let file: File = await this._wopiFileService.getFileInfobyId(fileId);
        return file.XWopiItemVersion ?? '1';
    }

    private isFileLocked(existingLockInfo: any) {
        return existingLockInfo.Expired ? false : true;
    }

    private returnErrorResponse(res: any, error: any) {
        if (typeof (error) === 'number') {
            let statusCode = error;
            return this._response.SendStatusCode(res, statusCode);
        }
        return this._response.ServerError(res, error);
    }

    private LogHeader() {
        //console.log(methodName);
        //console.log(`${methodName} : ${fileLocked ? 'Yes File Locked' : 'File Not Locked'}`);
        // console.log("new", newLock);
        // console.log("cLock", cLock);
        // console.log("olock", oLock);
    }

    private isXWopiValidLength(xWopiLock: string): boolean {
        try {
            if (xWopiLock && (xWopiLock.length >= 1024 || xWopiLock.length >= 256)) {
                return false;
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }

}