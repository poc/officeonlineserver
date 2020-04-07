import { IConsoleService } from "./iconsole.service";
import { injectable } from "inversify";
import { EnvironmentEnum } from "../../utils/enums/environment.enum";
@injectable()
export class ConsoleService implements IConsoleService{
    log(obj: any): void {
        console.log(obj);
    }
    
    logs(obj: any[]) {
    
        //if(config.env === EnvironmentEnum[EnvironmentEnum.Dev]){
            obj.forEach((e:any) => {
               // console.log(e);
            });
        //}
      
    }


}