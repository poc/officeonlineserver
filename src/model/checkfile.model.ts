
export class CheckFileModel {
    BaseFileName!: string | null;
    FileId!: string | null;
    OwnerId!: string | null;
    Size!: string | null;
    UserId!: string | null;
    Version!: string | null;
    UserInfo!: string | null;
    ReadOnly: boolean = false;
    UserCanWrite: boolean = false;
    IsAnonymousUser: boolean = false;
    SupportsUpdate: boolean = false;
    UserCanNotWriteRelative: boolean = false;
    SupportsUserInfo: boolean = false;
    SupportsGetLock: boolean = false;
    SupportsLocks: boolean = false;
    UserFriendlyName!: string | null;
    SupportsContainers: boolean = false;
    UserCanRename: boolean = false;
    UserCanPresent: boolean = false;
    SupportsExtendedLockLength: boolean = false;
    SupportsRename: boolean = false;
    SupportsDeleteFile: boolean = false;
}