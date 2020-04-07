import { DbModel } from "../model/db.model";

export interface IConfigService {
    isEnvVarsLoaded: boolean;
    endpointHost: string;
    assets: string;
    swagger : string;
    swaggerUi: string;
    views: string;
    tempFolder: string;
    env : string | undefined;
    wopiFileVersion: string;
    port: string | undefined;
    gateKeeperEndPoint: string | undefined;
    emptyStr: string;
    getCheckFileUrl:string;
    getFileContentUrl: string;
    putFileContentUrl: string;
    dbConfig: DbModel;
    coverageLink: string;
}