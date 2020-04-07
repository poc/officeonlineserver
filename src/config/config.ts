import path = require("path");
import * as dotenv from 'dotenv';
import { IConfigService } from "./iconfig.service";
import { injectable } from "inversify";
import  {DbModel} from "../model/index"; 

@injectable()
export class AppConfig implements IConfigService {
    public readonly coverageLink: string = path.join(__dirname, '../../coverage/lcov-report/');
    public readonly emptyStr: string = '';
    public readonly isEnvVarsLoaded = this.getEnvVariable();
    public readonly endpointHost = this.getEndPoint();
    public readonly assets = path.join(__dirname, '../../assets/');
    public readonly swagger = `${this.assets}swagger`;
    public readonly swaggerUi = `${this.assets}swagger/swagger-ui-dist`;
    public readonly views = `${this.assets}views`;
    public readonly tempFolder = `${this.assets}temp`;
    public readonly env = process.env.NODE_ENV;
    public readonly wopiFileVersion = '1';
    public readonly port = process.env.PORT || '3000';
    public readonly gateKeeperEndPoint :string = process.env.GateKeeper_END_POINT || "";
    public readonly getCheckFileUrl = `${this.gateKeeperEndPoint}msbridge/get-check-file-info/{fileId}`;
    public readonly putFileContentUrl = `${this.gateKeeperEndPoint}msbridge/update-file-content/{fileId}`;
    public readonly getFileContentUrl = `${this.gateKeeperEndPoint}msbridge/get-file-content/{fileId}`;
    public readonly dbConfig: DbModel = this.getDbConfig();


    private  getDbConfig(): DbModel {
        let db = new DbModel();
        let env = process.env;
        if(env.DB_HOST && env.DB_NAME) {
            db.Host = env.DB_HOST;
            db.Username = env.DB_USERNAME;
            db.Password = env.DB_PASS;
            db.Name = env.DB_NAME
            return db;
        }
        else {
            throw 'error in db config';
        } 
    }
    private getEndPoint(): string {
        let endpointHost = process.env.END_POINT || 'https://localhost:3000/';
        return endpointHost;
    }

    private getEnvVariable() {
        try {
            let envPath = path.resolve(__dirname, '../../.env')
            let loaded = dotenv.config({ path: envPath })
            return loaded ? true : false;
        }
        catch(e) {
            console.log(".env ", e);
            throw e;
        }
    }
}
