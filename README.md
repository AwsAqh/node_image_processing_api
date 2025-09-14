# Image Resize API

A modern Node.js API for dynamic image resizing with intelligent caching.

## 🚀 Features

- **Dynamic Image Resizing** - Resize images to any dimensions on-the-fly
- **Smart Caching** - Automatically caches processed images for optimal performance
- **RESTful API** - Clean, intuitive endpoints for easy integration
- **TypeScript** - Fully typed for better development experience
- **Comprehensive Testing** - Full test coverage with Jasmine and Supertest

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Sharp** - High-performance image processing
- **Jasmine** - Testing framework
- **Supertest** - HTTP assertion library

## 📁 Project Structure

```
image-processing-api/
├── src/
│   ├── controllers/
│   │   └── imagesController.ts
│   ├── routes/
│   │   ├── images.ts
│   │   └── thumbs.ts
│   ├── utilities/
│   │   └── imageProcessing.ts
│   ├── app.ts
│   └── server.ts
├── spec/
│   └── endpoints/
│       ├── imagesSpec.ts
│       └── thumbsSpec.ts
├── assets/
│   ├── full/          # Original images
│   └── thumbs/        # Processed thumbnails
└── dist/              # Compiled JavaScript
```

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd image-processing-api

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

The API will be available at `http://localhost:5050`

## 📖 API Documentation

### Base URL

```
http://localhost:5050
```

### Endpoints

#### 1. Resize Image

Resize an image to specified dimensions.

```http
GET /api/images?filename={name}&width={number}&height={number}
```

**Parameters:**

- `filename` (required) - Image filename (e.g., "fjord.jpg")
- `width` (required) - Target width in pixels
- `height` (required) - Target height in pixels

**Example:**

```http
GET /api/images?filename=fjord.jpg&width=300&height=200
```

**Response:** Returns the resized image directly

#### 2. List Thumbnails

Get a list of all available thumbnails.

```http
GET /thumbs
```

**Response:**

```json
{
  "success": true,
  "message": "List of all thumbnails.",
  "count": 3,
  "thumbs": ["fjord-300x200.jpg", "encenadaport-400x300.jpg"]
}
```

#### 3. Check Specific Thumbnail

Check if a specific thumbnail exists.

```http
GET /thumbs?filename={thumbnail-name}
```

**Example:**

```http
GET /thumbs?filename=fjord-300x200.jpg
```

**Response:**

```json
{
  "success": true,
  "message": "Thumbnail found.",
  "thumb": "fjord-300x200.jpg"
}
```

#### 4. Direct Thumbnail Access

Access thumbnails directly via static files.

```http
GET /static/thumbs/{filename}
```

**Example:**

```http
GET /static/thumbs/fjord-300x200.jpg
```

## 🖼️ Available Images

The API comes with sample images:

- `fjord.jpg`
- `encenadaport.jpg`
- `icelandwaterfall.jpg`
- `palmtunnel.jpg`
- `santamonica.jpg`

## ⚡ Performance Features

### Intelligent Caching

- First request: Processes and caches the image
- Subsequent requests: Serves from cache instantly
- Cache key format: `{original-name}-{width}x{height}.{ext}`

### Error Handling

Comprehensive error handling for all scenarios:

- Missing parameters
- Invalid dimensions
- File not found
- Processing errors

## 🧪 Testing

Run the test suite:

```bash
npm test
```

**Test Coverage:**

- Image processing utilities
- API endpoint validation
- Error handling scenarios
- Caching behavior

## 📝 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm run build      # Compile TypeScript to JavaScript
npm test           # Run test suite
npm run lint       # Check code quality
npm run format     # Format code with Prettier
```

## 🔧 Development

### Development Mode

```bash
npm run dev
```

Starts the server with nodemon for automatic restarts on file changes.

### Code Quality

```bash
npm run lint       # ESLint checks
npm run format     # Prettier formatting
```

## 📊 Example Usage

### Resize an Image

```bash
curl "http://localhost:5050/api/images?filename=fjord.jpg&width=500&height=300"
```

### List All Thumbnails

```bash
curl "http://localhost:5050/thumbs"
```

### Check Specific Thumbnail

```bash
curl "http://localhost:5050/thumbs?filename=fjord-500x300.jpg"
```

## 🚨 Error Responses

### Missing Parameters

```json
{
  "success": false,
  "message": "Filename is required"
}
```

### Invalid Dimensions

```json
{
  "success": false,
  "message": "Width and height must be positive numbers"
}
```

### File Not Found

```json
{
  "success": false,
  "message": "Image \"nonexistent.jpg\" not found in full folder"
}
```

## 🎯 Use Cases

- **E-commerce** - Dynamic product image resizing
- **Content Management** - Automatic thumbnail generation
- **Social Media** - Profile picture optimization
- **Web Development** - Responsive image serving

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using Node.js, Express, and TypeScript**
