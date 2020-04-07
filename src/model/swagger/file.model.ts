import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel( {
    description : "File model" ,
    name : "FileModel"
} )
export class FileModel {

    @ApiModelProperty( {
        description : "Id of version" ,
        required : false,
        example: ['123456789']
    } )
    id : string = "";

    @ApiModelProperty({
        description: "",
        required: false
    })
    name: string = "";

    @ApiModelProperty({
        description: "Description of version",
        required: false
    })
    stream!: Buffer | null;

    @ApiModelProperty({
        description: "Description of version",
        required: false
    })
    size: number = 0;
}