import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  ImageUploader = (
    file: string,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        file,
        { use_filename: true, folder },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            resolve(result);
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
