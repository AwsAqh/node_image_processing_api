import express from "express";
import processImageController from "../controllers/imagesController";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await processImageController(req, res);
    } catch {
    res.status(500).send("Server Error!!!!!!!");
  }
});

export default router;
