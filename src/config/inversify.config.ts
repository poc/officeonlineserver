import TYPES from './types';
import {Container} from 'inversify';
import { IResponseService } from '../services/response-service/iresponse.service';
import ResponseService from '../services/response-service/response.service';
import { IFileRepository } from '../repository/post-repository/ifile.repository';
import { FileRepository } from '../repository/post-repository/file.repository';
import { IWopiFileService } from '../services/wopi-file-service/iwopi-file.service';
import { WopiFileService } from '../services/wopi-file-service/wopi-file.service';
import { Repository, getRepository } from 'typeorm';
import { File } from '../entity/file';
import { IConsoleService } from '../services/console-service/iconsole.service';
import { ConsoleService } from '../services/console-service/console.service';
import { IConfigService } from './iconfig.service';
import { AppConfig } from './config';


/**
 * initialize the container
 */
const container = new Container();
/**
 * register dependancies
 */
container.bind<IResponseService>(TYPES.IResponseService ).to(ResponseService).inRequestScope();
container.bind<IWopiFileService>(TYPES.IWopiFileService ).to(WopiFileService).inRequestScope();
container.bind<IConsoleService>(TYPES.IConsoleService ).to(ConsoleService).inRequestScope();
container.bind<IConfigService>(TYPES.IConfigService ).to(AppConfig).inRequestScope();


container.bind<Repository<File>>(TYPES.FileRepository)
.toDynamicValue(() => {
    return getRepository(File);
})
.inTransientScope();
container.bind<IFileRepository>(TYPES.IFileRepository ).to(FileRepository).inRequestScope();


export default container;