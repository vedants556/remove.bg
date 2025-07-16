from flask import Flask, render_template, request, send_from_directory, jsonify, url_for
from rembg import remove
from PIL import Image
import os
import uuid # For unique filenames

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads' # Folder to temporarily store images
app.config['PROCESSED_FOLDER'] = 'static/processed' # Folder to store processed images
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit for uploads

# Create folders if they don't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"success": False, "message": "No file part in the request"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Invalid file type. Only PNG, JPG, JPEG are allowed."}), 400

    if file:
        unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(input_path)

        try:
            input_image = Image.open(input_path)
            output_image = remove(input_image)

            # Ensure output is PNG for transparency
            processed_filename = "processed_" + os.path.splitext(unique_filename)[0] + ".png"
            output_path = os.path.join(app.config['PROCESSED_FOLDER'], processed_filename)
            output_image.save(output_path, format="PNG")

            # Clean up the uploaded file
            os.remove(input_path)

            return jsonify({
                "success": True,
                "message": "Background removed successfully!",
                "processed_image_url": url_for('static', filename=f'processed/{processed_filename}')
            })
        except Exception as e:
            # Clean up the uploaded file even if processing fails
            if os.path.exists(input_path):
                os.remove(input_path)
            return jsonify({"success": False, "message": f"Error processing image: {e}"}), 500

    return jsonify({"success": False, "message": "An unexpected error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True)