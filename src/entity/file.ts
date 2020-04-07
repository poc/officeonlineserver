import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity()
export class File {

    @Column("int", {
        name: "Id"
    })
    @PrimaryGeneratedColumn()
    Id: number | undefined;

    @Column("varchar", {
        length: 250,
        name: "FileId",
        unique : true,
    })
    FileId!: string | null;

    @Column("varchar", {
        length: 1025,
        name: "XWopiLock",
    })
    XWopiLock!: string | null;

    @Column("varchar", {
        length: 111,
        name: "XWopiItemVersion",
    })
    XWopiItemVersion!: string | null;

    @Column("varchar", {
        length: 1000,
        name: "Token"
    })
    Token!: string | null;

    @Column("datetime", {
        name: "LockCreatedDate",
    })
    LockCreatedDate!: Date ;

    @Column("varchar", {
        length: 1024,
        name: "UserInfo"
    })
    UserInfo!: string | null;
}