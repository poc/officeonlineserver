import express from 'express';
import { IConfigService } from '../config/iconfig.service';
export class StaticsMiddleware {
    static use(app: any,_config:IConfigService) {
        app.use(express.static(_config.assets));
        app.use('/api-docs/swagger', express.static(_config.swagger));
        app.use('/api-docs/swagger/assets', express.static(_config.swaggerUi));
        app.use('/coverage', express.static(_config.coverageLink));
        app.locals.app = _config;
        app.set('views', _config.views);
        app.set('view engine', 'pug');
    }
}