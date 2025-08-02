# Background Removal Web App

A Flask-based web application that removes backgrounds from images using the `rembg` library. Upload an image and get back a version with the background removed, perfect for creating transparent PNG images.

## Features

- **Background Removal**: Automatically removes backgrounds from uploaded images
- **Multiple Format Support**: Accepts PNG, JPG, and JPEG files
- **Transparent Output**: Returns images with transparent backgrounds in PNG format
- **Unique File Handling**: Uses UUID-based naming to prevent conflicts
- **File Size Limits**: 16MB maximum upload size
- **Automatic Cleanup**: Removes temporary files after processing
- **Modern Web Interface**: Clean, responsive UI for easy image upload and download

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. **Clone the repository** (if using git):
   ```bash
   git clone <your-repository-url>
   cd remove.bg
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install flask rembg pillow
   ```

## Usage

1. **Start the application**:
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **Upload an image** by clicking the upload area or dragging and dropping a file

4. **Wait for processing** - the background will be automatically removed

5. **Download the result** - your processed image will be available for download

## Project Structure

```
remove.bg/
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # Web interface template
├── static/
│   ├── style.css         # CSS styling
│   ├── uploads/          # Temporary upload storage (auto-created)
│   └── processed/        # Processed image storage (auto-created)
├── venv/                 # Virtual environment (excluded from git)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## API Endpoints

- `GET /` - Main page with upload interface
- `POST /upload` - Upload and process image endpoint
  - Returns JSON response with success status and processed image URL

## Configuration

The application can be configured by modifying these settings in `app.py`:

- `UPLOAD_FOLDER`: Directory for temporary file storage
- `PROCESSED_FOLDER`: Directory for processed image storage
- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 16MB)
- `ALLOWED_EXTENSIONS`: Supported image file types

## Dependencies

- **Flask**: Web framework for the application
- **rembg**: Background removal library using deep learning
- **Pillow (PIL)**: Image processing library
- **uuid**: For generating unique filenames

## Development

To run the application in development mode with auto-reload:

```bash
python app.py
```

The application will run in debug mode, automatically reloading when files change.

## Deployment

For production deployment, consider:

1. Using a production WSGI server like Gunicorn
2. Setting up proper file storage (e.g., cloud storage)
3. Implementing user authentication
4. Adding rate limiting
5. Using environment variables for configuration

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions, please [create an issue](link-to-issues) in the repository. 