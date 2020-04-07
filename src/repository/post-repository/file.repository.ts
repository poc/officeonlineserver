
import { injectable, inject } from "inversify";
import { IFileRepository } from "./ifile.repository";
import { BaseRepository } from "./base.repository";
import { File as file } from "../../entity/file";
import { getRepository, Repository } from "typeorm";
import TYPES from "../../config/types";

@injectable()
export class FileRepository extends BaseRepository<file> implements IFileRepository {


    constructor( @inject(TYPES.FileRepository) repository: Repository<file>) {
        super(repository);
    }

}