import * as bodyParser from 'body-parser';
export class BodyParserMiddleware {
    static use(app: any) {
        app.use(bodyParser.urlencoded({
            extended: true
          }));
          app.use(bodyParser.json());
    }
}