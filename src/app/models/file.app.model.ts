export class File {
  _id!: string;
  length!: number;
  chunkSize!: number;
  uploadDate!: Date;
  fileName!: string;
  md5!: string;
  contentType!: string;
}
