import { injectable } from "inversify";
import { Entity, getRepository, Repository } from "typeorm";
import { File as file } from "../../entity/file";
import { IBaseRepository } from "./ibase.repository";
//import { getEntityManager } from 'typeorm';
@injectable()
export class BaseRepository<T> implements IBaseRepository<T> {


    private repository: Repository<T>;

    constructor(repository: Repository<T>){
        this.repository = repository;
    }


    async find(filter: any)
    {
        return  await this.repository.find(filter);
    }

    async findOne(filter: any)
    {
        return  await this.repository.findOne(filter);
    }

    async save(tModel: T)
    {
        return  await this.repository.save(tModel);
    }

    async update(criteria: any, tModel: T)
    {
        return  await this.repository.update(criteria, tModel);
    }

    async delete(filter: any) {
        return  await this.repository.delete(filter);
    }
}