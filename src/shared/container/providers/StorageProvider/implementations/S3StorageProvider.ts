import fs from 'fs';
import path from 'path';
import { S3 } from 'aws-sdk';
import mime from 'mime';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/modules/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3();
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('Avatar file content type not found');
    }

    const fileContent = fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.config.s3.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.s3.bucket,
        Key: file,
      })
      .promise();
  }
}

export default DiskStorageProvider;
