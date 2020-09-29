import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads');

interface IUploadConfig {
  driver: 's3' | 'disk';

  uploadsFolder: string;
  tmpFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    s3: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  uploadsFolder,
  tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    s3: {
      bucket: process.env.BUCKET_NAME,
    },
  },
} as IUploadConfig;
