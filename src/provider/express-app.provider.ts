import express from 'express';
import { AppConfig } from "../config/config";
import { ResReqMiddleware } from '../middleware/res-req.middleware';
import fileUpload from 'express-fileupload';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CorsMiddleware } from '../middleware/cors.middleware';
import { StaticsMiddleware } from '../middleware/statics.middleware';
import { BodyParserMiddleware } from '../middleware/body-parser.middleware';
import { SwaggerMiddleware } from '../middleware/swagger.middleware';

/**
 * Configure Express application and middleware
 */
export class ExpressApp {

    private readonly _config: AppConfig;

    constructor(config: AppConfig) {
      this._config = config;
    }
/**
 * Register Middlewares
 * @param app 
 */
    public registerMiddleware(app: express.Application): express.Application {
      CorsMiddleware.use(app);
      AuthMiddleware.use(app);
      ResReqMiddleware.init(app);
      StaticsMiddleware.use(app,this._config);
      BodyParserMiddleware.use(app);
      SwaggerMiddleware.use(app);
      app.use(fileUpload());
      return app;
    }
  }