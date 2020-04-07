
export class Helper
{
    public static getBuffer(data:any, encoding?:BufferEncoding): Buffer {
        let enc = encoding ?? "binary"
        return Buffer.from(data,enc);
    }
}