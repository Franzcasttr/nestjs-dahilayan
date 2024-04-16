import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  ImageUploader = (
    file: string,
    folder: string,
  ): Promise<
    | {
        secure_url: string;
        public_id: string;
      }
    | UploadApiErrorResponse
  > => {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        file,
        { use_filename: true, folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            const uploadResult: {
              secure_url: string;
              public_id: string;
            } = {
              secure_url: result.secure_url,
              public_id: result.public_id,
            };
            resolve(uploadResult);
          }
        },
      );
    });
  };

  DeleteImage = (file: string[]) => {
    file.forEach((ids) => {
      return new Promise((resolve, reject) => {
        v2.uploader.destroy(ids, (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            resolve(result);
          }
        });
      });
    });
  };
}
