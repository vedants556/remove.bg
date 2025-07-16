from flask import Flask, render_template, request, send_from_directory
from rembg import remove
from PIL import Image
import os
import uuid # For unique filenames

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads' # Folder to temporarily store images
app.config['PROCESSED_FOLDER'] = 'static/processed' # Folder to store processed images

# Create folders if they don't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return "No image part in the request", 400

    file = request.files['image']
    if file.filename == '':
        return "No selected file", 400

    if file:
        unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(input_path)

        try:
            input_image = Image.open(input_path)
            output_image = remove(input_image)

            # ...
            # processed_filename = "processed_" + unique_filename # Original line
            processed_filename = "processed_" + os.path.splitext(unique_filename)[0] + ".png" # Change extension to .png
            output_path = os.path.join(app.config['PROCESSED_FOLDER'], processed_filename)
            output_image.save(output_path, format="PNG") # Explicitly save as PNG
            # ...
            # Clean up the uploaded file
            os.remove(input_path)

            return render_template('index.html', processed_image=f'processed/{processed_filename}')
        except Exception as e:
            return f"Error processing image: {e}", 500

if __name__ == '__main__':
    app.run(debug=True) # debug=True for development, turn off for production