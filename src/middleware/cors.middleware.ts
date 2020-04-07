var cors = require('cors');
export class CorsMiddleware {
    static use(app: any) {
        app.use(cors({
            origin: '*'
          }));
    }
}