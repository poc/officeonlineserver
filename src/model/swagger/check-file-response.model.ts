import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel( {
    description : "CheckFileResponseModel" ,
    name : "CheckFileResponseModel"
} )
export class CheckFileResponseModel {  
    @ApiModelProperty({
        required: true
    })
    FileId!: string;
    @ApiModelProperty({
        required: true
    })
    BaseFileName!: string;
    @ApiModelProperty({
        required: true
    })
    OwnerId!: string;
    @ApiModelProperty({
        required: true
    })
    Size!: string;
    @ApiModelProperty({
        required: true
    })
    UserId!: string;
    @ApiModelProperty({
        required: true
    })
    Version!: string;
    @ApiModelProperty({
        required: true
    })
    UserInfo!: string;
    @ApiModelProperty({
        required: true
    })
    ReadOnly: boolean = false;
    @ApiModelProperty({
        required: true
    })
    UserCanWrite: boolean = false;
    @ApiModelProperty({
        required: true
    })
    IsAnonymousUser: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsUpdate: boolean = false;
    @ApiModelProperty({
        required: true
    })
    UserCanNotWriteRelative: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsUserInfo: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsGetLock: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsLocks: boolean = false;
    @ApiModelProperty({
        required: true
    })
    UserFriendlyName: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsContainers: boolean = false;
    @ApiModelProperty({
        required: true
    })
    UserCanRename: boolean = false;
    @ApiModelProperty({
        required: true
    })
    UserCanPresent: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsExtendedLockLength: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsRename: boolean = false;
    @ApiModelProperty({
        required: true
    })
    SupportsDeleteFile: boolean = false;
}