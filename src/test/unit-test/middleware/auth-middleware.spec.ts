import { expect } from 'chai';
import 'mocha';
import {AuthMiddleware} from '../../../middleware/auth.middleware';
import * as sinon from "sinon"

describe("Auth Middleware", () => {

    before(async function () {

    })

    after(async function () {

    });


    beforeEach(async function () {

    });


    describe("#Unauthorize", () => {
        it('should return 401 unauthorized ', (done) => {
                let expected = 401;
                let actual;
                let mockApp = {
                    use : function(cb:any) {
                        let headers = {
                            authorization : 'Bearer INVALID'
                        }
                        let req = {
                            headers
                        }
                        let next = function(){ console.log('next middleware'); }
                        let res = {
                            sendStatus : function(code:number) {
                                actual = code;
                            }
                        }
                        cb(req, res, next);
                    },
                }

                AuthMiddleware.use(mockApp);
                expect(actual).to.equal(expected)
                done();
        });
    });

    describe("#Authorize", () => {
        it('should be authorized ', (done) => {
                let expected = 200;
                let actual;
                let mockApp = {
                    use : function(cb:any) {
                        let headers = {
                            authorization : 'Bearer '
                        }
                        let req = {
                            headers
                        }
                        let next = function(){ actual = 200}
                        let res = {
                            sendStatus : function(code:number) {
                                actual = code;
                            }
                        }
                        cb(req, res, next);
                    },
                }

                AuthMiddleware.use(mockApp);
                expect(actual).to.equal(expected)
                done();
        });
    });

});