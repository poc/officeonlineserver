import { injectable, inject } from "inversify";
import { IWopiFileService } from "./iwopi-file.service";
import { IFileRepository } from "../../repository/post-repository/ifile.repository";
import TYPES from "../../config/types";
import { File } from "../../entity/file";
const axios = require('axios').default;
import { IConfigService } from "../../config/iconfig.service";
import fs from 'fs'
import { Helper } from "../../utils/helper";

@injectable()
export class WopiFileService implements IWopiFileService {

    private _fileRepository: IFileRepository;
    private _config: IConfigService;

    constructor(@inject(TYPES.IFileRepository) fileRepository: IFileRepository,
        @inject(TYPES.IConfigService) config: IConfigService) {
        this._fileRepository = fileRepository;
        this._config = config;
    }

    async checkFileInfo(fileId: string, accessToken?: string) {
        let option = {
            headers: {
                authorization: accessToken,
            }
        }
        return await new Promise((res, rej) => {
            axios.get(this._config.getCheckFileUrl.replace("{fileId}", fileId), option)
                .then(function (response: any) {
                    let data = response.data;
                    res(data);
                })
                .catch(function (error: any) {
                    let status = error.response.status;
                    rej(status);
                })
        })
    }

    async getFileInfobyId(fileId: string) {
        let fileO: File = await this._fileRepository.findOne({ FileId: fileId });
        return fileO;
    }

    async getFileBytes(fileId: any, accessToken?: string) {
        let option = {
            headers: {
                authorization: accessToken,
            }
        }
        return await new Promise((res, rej) => {
            axios.get(this._config.getFileContentUrl.replace("{fileId}", fileId), option)
                .then(function (response: any) {
                    let data = response.data;
                    let stream = Helper.getBuffer(data, "binary");
                    res(stream);
                })
                .catch(function (error: any) {
                    let status = error.response.status;
                    rej(status);
                })
        })
    }

    // async getFiles() {
    //     let repo = await this._fileRepository.find({});
    //     return repo;
    // }

    async saveFileInfo(fileModel: any) {
        return await this._fileRepository.save(fileModel);
    }

    async deleteFile(fileId: any) {
        return await this._fileRepository.delete({ FileId: fileId });
    }



    async updateFile(fileO: any) {
        let isSv = await this._fileRepository.update({ FileId: fileO.FileId }, fileO);
        return isSv;
    }

    async updateFileBytes(fileId: any, data: any, accessToken?: string) {
        let option = {
            headers: {
                authorization: accessToken ?? "",
            }
        }
        return new Promise((res, rej) => {
            let stream = Helper.getBuffer(data, 'binary');
            axios.post(this._config.putFileContentUrl.replace("{fileId}", fileId), {
                stream
            }, option)
                .then(function (response: any) {
                    res(response);
                })
                .catch(function (error: any) {
                    let status = error.response.status;
                    rej(status);
                });
        });
    }

    async puttempFile(fileId: any, data: any) {
        let tempName = fileId;
        let filePath = this.getTempFilePath(tempName);
        return await new Promise((res, rej) => {
            fs.writeFile(filePath, data, function (err) {
                if (err) {
                    rej(err);
                } else {
                    res(true);
                }
            });
        });
    }


    async isTempFileExist(fileName: any) {
        let filePath = this.getTempFilePath(fileName);
        if (fs.existsSync(filePath)) {
            return true;
        }
        return false;
    }


    async getTempFileDetail(fileId: any) {
        try {
            let filePath = this.getTempFilePath(fileId);
            let fileDetail = fs.statSync(filePath)
            return fileDetail;
        }
        catch (e) {
            return null;
        }
    }


    async readTempFile(fileName: any, encoding: string = "binary") {
        try {
            let filePath = this.getTempFilePath(fileName);
            return fs.readFileSync(filePath, encoding);
        }
        catch (e) {
            return false;
        }
    }

    async deleteTempFile(fileId: any) {
        let tempName = fileId;
        let filePath = this.getTempFilePath(tempName);
        try {
            fs.unlinkSync(filePath);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    private getTempFilePath(fileName: string) {
        // let fileSp = fileName.split("-vsn")
        // if (fileSp) {
        //     fileName = fileSp[0];
        // }
        let file = `${this._config.tempFolder}/${fileName}`;
        return file;
    }

}