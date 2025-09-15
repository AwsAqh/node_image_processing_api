"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const images_1 = __importDefault(require("./routes/images"));
const thumbs_1 = __importDefault(require("./routes/thumbs"));
const app = (0, express_1.default)();
app.set('json spaces', 2);
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Welcome - Image Processing API</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom right,rgb(188, 111, 56),rgb(1, 0, 0));
          color: #4f4f4f;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.85);
          padding: 30px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        h1 {
          margin-bottom: 20px;
          font-size: 2em;
        }
        p {
          margin: 10px 0;
          font-size: 1.1em;
        }
        code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
       
        <code>/api/images?filename=[filename]&width=[width]&height=[height]</code></p>
        <code>/thumbs</code></p>
      </div>
    </body>
    </html>
  `);
});
app.use('/static/thumbs', express_1.default.static(path_1.default.join(__dirname, '../assets/thumbs')));
app.use('/static/thumbs', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Thumbnail image not found',
        requestedFile: req.url,
    });
});
app.use('/api/images', images_1.default);
app.use('/thumbs', thumbs_1.default);
exports.default = app;
