import { Request, Response } from "express";
import { resizeImage } from "../utilities/imageProcessing";
import { Logger } from "../utilities/logger";

const processImageController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let filename = req.query.filename as string;
    if (!filename.toLowerCase().endsWith(".jpg")) filename += ".jpg";

    const width = parseInt(req.query.width as string);
    const height = parseInt(req.query.height as string);

    if (!filename) {
      Logger.error("Filename is missing");
      res.status(400).send("Filename is required");
      return;
    }

    if (!width || !height) {
      Logger.error("Width or height missing");
      res.status(400).send("Width and height are required");
      return;
    }

    if (width <= 0 || height <= 0) {
      Logger.error("Width or height not positive");
      res.status(400).send("Width and height must be positive numbers");
      return;
    }

    const imagePath = await resizeImage(filename, width, height);
    res.status(200).sendFile(imagePath);
  } catch (error) {
    console.error("something went wrong", error);

    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      res.status((error as any).status).send((error as any).message);
    } else {
      res.status(500).send("Server Error!!!!!!!");
    }
  }
};

export default processImageController;
