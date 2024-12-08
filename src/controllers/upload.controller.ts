import { NextFunction, Request, Response } from "express";

export class UploadController {
  // method for uploading single file
  async addNewImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;

      if (!file) throw new Error("Tidak ada file yang diunggah!");

      res.status(200).send(`Berkas ${file.filename} berhasil diunggah!`);
    } catch (err) {
      next(err);
    }
  }

  // method for uploading multiple images
  async addMultipleNewImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { files } = req;

      if (!files?.length) throw new Error("Tidak ada file yang diunggah!");

      res.status(200).send(`Berkas berhasil diunggah!`);
    } catch (err) {
      next(err);
    }
  }
}
