"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageProcessing_1 = require("../utilities/imageProcessing");
const processImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filename = req.query.filename;
        const width = parseInt(req.query.width);
        const height = parseInt(req.query.height);
        if (!filename) {
            console.log('Error: filename is missing');
            res.status(400).send('Filename is required');
            return;
        }
        if (!width || !height) {
            console.log('Error: width or height missing');
            res.status(400).send('Width and height are required');
            return;
        }
        if (width <= 0 || height <= 0) {
            console.log('Error: width or height not positive');
            res.status(400).send('Width and height must be positive numbers');
            return;
        }
        const imagePath = yield (0, imageProcessing_1.resizeImage)(filename, width, height);
        res.status(200).sendFile(imagePath);
    }
    catch (error) {
        console.error('something went wrong', error);
        if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
            res.status(error.status).send(error.message);
        }
        else {
            res.status(500).send('Server Error!!!!!!!');
        }
    }
});
exports.default = processImageController;
