import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
const checkfile = require('../fixtures/checkfile.json');
import { WopiFileService } from '../../services/wopi-file-service/wopi-file.service'
import * as sinon from "sinon";
import { AppConfig } from "../../config/config";
import { FileRepository } from "../../repository/post-repository/file.repository";
const axios = require('axios').default;
import { IFileRepository } from "../../repository/post-repository/ifile.repository";
import { IConfigService } from "../../config/iconfig.service";
import { File } from '../../entity/file';
import { Helper } from "../../utils/helper";
import fs, { Stats } from 'fs'
describe("File Service", () => {

    let sandbox: sinon.SinonSandbox;
    const fileId = 'sample.wopitest';
    let response: any;
    let errorResponse: any;
    let accessToken: string = 'Bearer ashdfj235'

    before(async function () {
        //sandbox = sinon.createSandbox();
    })

    afterEach(async function () {
        sandbox.restore();
        //sinon.stub(axios,'get').restore();
    });


    beforeEach(async function () {
        sandbox = sinon.createSandbox();
        response = {
            data: checkfile.success.body,
            status: checkfile.success.res.statusCode,
            headers: checkfile.success.res.headers
        };

        errorResponse = {
            response: {
                status: 500
            }
        }
    });


    describe("#Get File", () => {
        const mockFileRepo: IFileRepository = {
            findOne: sinon.fake.returns({ FileId: fileId }),
            find: sinon.spy(),
            save: sinon.fake.returns({ FileId: fileId }),
            update: sinon.fake.returns({ affected: 1 }),
            delete: sinon.fake.returns({ affected: 1 })
        };

        const configMock: IConfigService = new AppConfig();
        let wf = new WopiFileService(mockFileRepo, configMock);
        it('should reuturn file', (done) => {
            sandbox.stub(axios, 'get').returns(Promise.resolve(response));
            wf.checkFileInfo(fileId).then((x: any) => {
                expect(x.BaseFileName).to.equal(fileId);
                done();
            })
        });

        it('should reuturn file 500 exception', (done) => {
            errorResponse.response.status = 500;
            sandbox.stub(axios, 'get').returns(Promise.reject(errorResponse));
            wf.checkFileInfo(fileId).catch((e: any) => {
                expect(e).to.equal(500);
                done();
            });
        });


        it('should reuturn file 404 exception', (done) => {
            errorResponse.response.status = 404;
            sandbox.stub(axios, 'get').returns(Promise.reject(errorResponse));
            wf.checkFileInfo(fileId).catch((e: any) => {
                expect(e).to.equal(404);
                done();
            });
        });

        it('should reuturn file 401 exception', (done) => {
            errorResponse.response.status = 401;
            sandbox.stub(axios, 'get').returns(Promise.reject(errorResponse));
            wf.checkFileInfo(fileId).catch((e: any) => {
                expect(e).to.equal(401);
                done();
            });
        });

        it('should reuturn File by id', (done) => {
            wf.getFileInfobyId(fileId).then((x: any) => {
                expect(x.FileId).to.equal(fileId);
                done();
            });
        });

        describe("#Get Binary File Content", () => {
            it('should reuturn file contents', (done) => {
                let binaryFile = Helper.getBuffer(fileId, 'binary');
                response.data = binaryFile;
                sandbox.stub(axios, 'get').returns(Promise.resolve(response));
                wf.getFileBytes(fileId).then((x: any) => {
                    expect(x.toString()).to.equal(fileId);
                    done();
                })
            });


            it('should reuturn exception', (done) => {
                sandbox.stub(axios, 'get').returns(Promise.reject(errorResponse));
                wf.getFileBytes(fileId).catch((x: any) => {
                    expect(x).to.equal(500);
                    done();
                })
            });

        });
        describe("#Save file info db", () => {

            let fileModel: File = new File();
            fileModel.FileId = fileId;
            it('should reuturn saved file', (done) => {
                wf.saveFileInfo(fileModel).then((x: any) => {
                    expect(x.FileId).to.equal(fileId);
                    done();
                });
            });
        });



        describe("#Delete file info db", () => {
            it('should return affected rows equal to 1', (done) => {
                wf.deleteFile(fileId).then((x: any) => {
                    expect(x.affected).to.equal(1);
                    done();
                });
            });
        });


        describe("#Update file info db", () => {
            let fileModel: File = new File();
            fileModel.FileId = fileId;
            it('should return affected rows equal to 1', (done) => {
                wf.updateFile(fileModel).then((x: any) => {
                    expect(x.affected).to.equal(1);
                    done();
                });
            });
        });

        describe("#POST Update file binary content  gatekeeper", () => {
            it('should return 200', (done) => {
                response.data = null;
                let binaryFile = Helper.getBuffer(fileId, 'binary');
                sandbox.stub(axios, 'post').returns(Promise.resolve(response));
                wf.updateFileBytes(fileId,binaryFile,accessToken).then((x: any) => {
                    expect(x.status).to.equal(200);
                    done();
                })
            });

            it('should return exception', (done) => {
                let binaryFile = Helper.getBuffer(fileId, 'binary');
                sandbox.stub(axios, 'post').returns(Promise.reject(errorResponse));
                wf.updateFileBytes(fileId,binaryFile,accessToken).catch((x: any) => {
                    expect(x).to.equal(500);
                    done();
                })
            });

            it('should return 401 unauthorize', (done) => {
                let binaryFile = Helper.getBuffer(fileId, 'binary');
                errorResponse.response.status = 401
                sandbox.stub(axios, 'post').returns(Promise.reject(errorResponse));
                wf.updateFileBytes(fileId,binaryFile).catch((x: any) => {
                    expect(x).to.equal(401);
                    done();
                })
            });
        });


        describe("#Put File , update binary on temp file", () => {
            it('should return true', (done) => {
                let binaryFile = Helper.getBuffer(fileId, 'binary');
                sandbox.stub(fs, 'writeFile').callsArg(2).yields(false);
                wf.puttempFile(fileId,binaryFile).then((x: any) => {
                    expect(x).to.equal(true);
                    done();
                })
            });

            it('should return error', (done) => {
                let binaryFile = Helper.getBuffer(fileId, 'binary');
                sandbox.stub(fs, 'writeFile').callsArg(2).yields({error: 'file not exist'});
                wf.puttempFile(fileId,binaryFile).catch((x: any) => {
                    expect(x.error).to.equal('file not exist');
                    done();
                })
            });
        });


        describe("#Temp File Exist", () => {
            it('should return true, if file exist', (done) => {
                sandbox.stub(fs, 'existsSync').returns(true);
                wf.isTempFileExist(fileId).then((x: any) => {
                    expect(x).to.equal(true);
                    done();
                })
            });

            it('should return false, if file not exist', (done) => {
                sandbox.stub(fs, 'existsSync').returns(false);
                wf.isTempFileExist(fileId).then((x: any) => {
                    expect(x).to.equal(false);
                    done();
                })
            });
        });

        describe("#Get File Detail", () => {
            it('should return file detail, if file exist', (done) => {
                sandbox.stub(fs, 'statSync').returns({size: 100} as Stats);
                wf.getTempFileDetail(fileId).then((x: any) => {
                    expect(x.size).to.equal(100);
                    done();
                })
            });

            it('should return null, if file not exist', (done) => {
                sandbox.stub(fs, 'statSync').throwsException({error: 'file not exist'});
                wf.getTempFileDetail(fileId).then((x: any) => {
                    expect(x).to.equal(null);
                    done();
                })
            });
        });


        describe("#Read Temp File", () => {
            let file = Helper.getBuffer('this is test file')
            it('should return file, if file exist', (done) => {
                sandbox.stub(fs, 'readFileSync').returns(file);
                wf.readTempFile(fileId).then((x: any) => {
                 
                    expect(x.toString()).to.equal('this is test file');
                    done();
                })
            });

            it('should return false, if file not exist', (done) => {
                sandbox.stub(fs, 'readFileSync').throwsException({error: 'file not exist'});
                wf.readTempFile(fileId).then((x: any) => {
                    expect(x).to.equal(false);
                    done();
                })
            });
        });


        describe("#Delete temp file", () => {
            it('should return true, if file exist', (done) => {
                sandbox.stub(fs, 'unlinkSync').returns()
                wf.deleteTempFile(fileId).then((x: any) => {
                    expect(x).to.equal(true);
                    done();
                })
            });

            it('should return false, if file not exist', (done) => {
                sandbox.stub(fs, 'unlinkSync').throwsException({error: 'file not exist'});
                wf.deleteTempFile(fileId).then((x: any) => {
                    expect(x).to.equal(false);
                    done();
                })
            });

        });

    })
});