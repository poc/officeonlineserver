import "reflect-metadata";
import { AppConfig } from './config/config';
import { ExpressApp } from './provider/express-app.provider';
import { App } from './provider/app';

/**
 * Main Program
 */

export class Program {

    /**
     * Main Function
     */
    public static async main(): Promise<any> {
        let config = new AppConfig();
        let expressApp = new ExpressApp(config);
        let loadApp = new App(config, expressApp);
        await loadApp.loadDb();
        await loadApp.loadServer();
    }

}

/****
 * Load Main Program;
 */
Program.main();