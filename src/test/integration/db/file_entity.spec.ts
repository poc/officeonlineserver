import { expect } from 'chai';
import 'mocha';
import {Connection, Repository, DeleteResult } from 'typeorm';
import connection from "./test-db-connection"
import { File } from "../../../entity/file"

describe("Data Base Connection and entity Test", () => {
    let con: Connection;
    let fileRepo: Repository<File>;
    before(async function () {
        con = await connection;
        fileRepo = con.getRepository(File);
        await fileRepo.delete({});
    })

    after(async function () {
        await fileRepo.delete({});
        await con.close();
    });


    beforeEach(async function() {
        await fileRepo.delete({});
      });


      describe("#findOne", () => {
        it('Get File', (done) => {
            let file = new File();
            file.FileId = 'file1';
            file.XWopiItemVersion = '1';
            fileRepo.save(file).then(saveFile => {
                fileRepo.findOne({FileId: 'file1'}).then((fileO:any) => {
                    let fileId = fileO.FileId ?? '';
                   expect(fileId).to.equal('file1');
                    done();
                }).catch((e:any) => {
                    done(e);
                });
            }).catch((e:any) => {
                done(e);
            });;

        });
    })


    describe("#find", () => {
        it('Get Files', (done) => {
            let file = new File();
            file.FileId = 'file1';
            file.XWopiItemVersion = '1';
            let file2 = new File();
            file2.FileId = 'file2';
            file2.XWopiItemVersion = '1';
            fileRepo.save([file, file2]).then(saveFile => {
                fileRepo.find({}).then(files => {
                    expect(files.length).to.equal(2);
                    done();
                }).catch(e => {
                    done(e);
                });
            }).catch(e => {
                done(e);
            });;

        });
    })

    describe("#save", () => {
        it('save file', (done) => {
            let file = new File();
            file.FileId = 'file1';
            file.XWopiItemVersion = '1';
            fileRepo.save(file).then(saveFile => {
                expect(saveFile.FileId).to.equal('file1');
                done();
            }).catch(e => {
                done(e);
            });
        });
    })


    describe("#update", () => {
        it('update file', (done) => {
            let file = new File();
            file.FileId = 'file1';
            file.XWopiItemVersion = '1';
            fileRepo.save(file).then(saveFile => {
                saveFile.XWopiItemVersion ='2';
                fileRepo.save(saveFile).then(upFile=> {
                    expect(upFile.XWopiItemVersion).to.equal('2');
                    done();
                }
                ).catch(e => {
                    done(e);
                });
            }).catch(e => {
                done(e);
            });
        });
    })



    describe("#Delete", () => {
        it('Delete File', (done) => {
            let file = new File();
            file.FileId = 'file1';
            file.XWopiItemVersion = '1';
            fileRepo.save(file).then(saveFile => {
                fileRepo.delete({FileId: 'file1'}).then((files:DeleteResult) => {
                    expect(files.affected).to.equal(1);
                    done();
                }).catch(e => {
                    done(e);
                });
            }).catch(e => {
                done(e);
            });;

        });
    })



})





