//import { expect } from 'chai';
import 'mocha';
import * as sinon from "sinon"
const request = require('request');
const chai = require('chai');
const should = chai.should();
const checkfile = require('../../fixtures/checkfile.json');
const base = 'http://localhost:3000';
describe('Wopi', () => {
    let requestGet: any;
    let requestPost: any;
    beforeEach(() => {
        requestGet = sinon.stub(request, 'get');
        requestPost = sinon.stub(request, 'post');
    });

    afterEach(() => {
        request.get.restore();
        request.post.restore();
    });

    describe('GET /wopi/files/sample.docx', () => {
        it('should return check file info', (done) => {
            requestGet.yields(null, checkfile.success.res, JSON.stringify(checkfile.success.body));
            request.get(`${base}/wopi/files/sample.docx`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.BaseFileName.should.eql('sample.wopitest');
                done();
            });
        });
    });

    describe('GET /wopi/files/sample.docx', () => {
        it('should return 500 server error', (done) => {
            requestGet.yields(null, checkfile.failure.internalServerError, JSON.stringify({}));
            request.get(`${base}/wopi/files/sample.docx`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(500);
                done();
            });
        });
    });

    describe('GET /wopi/files/sample.docx', () => {
        it('should return 401 unauthorized error', (done) => {
            requestGet.yields(null, checkfile.failure.Unauthorized, JSON.stringify({}));
            request.get(`${base}/wopi/files/sample.docx`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(401);
                done();
            });
        });
    });

    describe('GET /wopi/files/sample.docx', () => {
        it('should return 404 Not found error', (done) => {
            requestGet.yields(null, checkfile.failure.NotFound, JSON.stringify({}));
            request.get(`${base}/wopi/files/sample.docx`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(404);
                done();
            });
        });
    });


    describe('GET /wopi/files/sample.docx', () => {
        let str = 'this is test binary file';
        let res = {
            "statusCode": 200,
            "headers": {
                "content-type": "application/octet-stream"
            }

        };
    

        it('should return binary content file', (done) => {
            let data = new Buffer(str, 'binary');
            requestGet.yields(null, res, data);
            request.get(`${base}/wopi/files/sample.docx/contents`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/octet-stream');
                body.toString().should.eql('this is test binary file');
                done();
            });
        });

        it('should return 500 no file', (done) => {
            let data='';
            res.statusCode = 500;
            requestGet.yields(null, res, data);
            request.get(`${base}/wopi/files/sample.docx/contents`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(500);
                body.should.eql('');
                done();
            });
        });
    });

    describe('GET /wopi/files/sample.docx/save', () => {
        it('should return 200 File save', (done) => {
            requestGet.yields(null, checkfile.success.res, JSON.stringify({ mes: "file is updated/saved" }));
            request.get(`${base}/wopi/files/sample.docx`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.mes.should.eql("file is updated/saved");
                done();
            });
        });
    });


    describe('GET /wopi/files/sample.docx/close', () => {
        it('should return 200 File Close', (done) => {
            requestGet.yields(null, checkfile.success.res, JSON.stringify({ mes: "file is closed" }));
            request.get(`${base}/wopi/files/sample.docx`, (err: any, res: any, body: any) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.mes.should.eql("file is closed");
                done();
            });
        });
    });

});

