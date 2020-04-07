export interface IWopiFileService {
    checkFileInfo(fileId: string, accessToken?: string): any;
    getFileInfobyId(fileId: string): any;
    updateFile(fileO: any): any;
    saveFileInfo(fileO: any): any;
    getFileBytes(fileId: any, accessToken?: string): any;
    updateFileBytes(fileId: any, data: any, accessToken?: string): any;
    puttempFile(fileId:any, data:any):any;
    deleteFile(fileId:any):any;
    deleteTempFile(fileId:any):any;
    getTempFileDetail(fileId: any):any;
    isTempFileExist(fileName:any):any;
    readTempFile(fileName:any,encoding?: string):any;
}