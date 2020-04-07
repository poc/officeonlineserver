export interface IBaseRepository<T> 
{
    find(filter: any) : any;
    save(tModel: T) :any;
    findOne(filter: any): any;
    update(criteria: any,tModel: T) :any;
    delete(filter: any) : any;
}