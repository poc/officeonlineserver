import { InversifyExpressServer } from "inversify-express-utils";
import container from "../config/inversify.config";
import { createConnection, Connection } from 'typeorm';
import { File } from "../entity/file"
import { ExpressApp } from "./express-app.provider";
import { IConfigService } from "../config/iconfig.service";
import '../controller/index'
import '../model/swagger/index';

/**
 * App, Loading Db, Express and  Drivers
 */
export class App {

  private readonly _config: IConfigService;
  private readonly _appExpress?: ExpressApp;

  constructor(config: IConfigService, appExpress?: ExpressApp) {
    this._config = config;
    this._appExpress = appExpress;
  }

  /**
   * Load and listen server
   */
  public async loadServer() {
    let appO = this;
    return new Promise((res, rej) => {
      let server: InversifyExpressServer = new InversifyExpressServer(container);
      if (appO._appExpress)
        server.setConfig(app => {
          if (appO._appExpress)
            appO._appExpress.registerMiddleware(app);
        });
      let appConfigured = server.build();
      let serve: any = appConfigured.listen(appO._config.port, () => {
        console.log(`App running on ${serve.address().port}`);
        res(appO._config.port);
      });
    })
  }

  /**
   * Loading and configure database
   */
  public async loadDb() {
    let dbConfig = this._config.dbConfig;
    return new Promise((res, rej) => {
      createConnection({
        type: "mysql",
        host: dbConfig.Host,
        username: dbConfig.Username,
        password: dbConfig.Password,
        database: dbConfig.Name,
        entities: [File]
      }).then(async (connection: Connection) => {
        await connection.synchronize();
        res(connection);
      }).catch(error => {
        rej(error);
        console.log("database error.... ", error);
      });
    })
  }
}






