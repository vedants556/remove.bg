document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const imagePreview = document.getElementById('image-preview');
    const previewContainer = document.getElementById('preview-container');
    const fileNameDisplay = document.getElementById('file-name-display');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressContainer = document.getElementById('progress-container');
    const messageContainer = document.getElementById('message-container');
    const resultSection = document.getElementById('result-section');

    let selectedFile = null;

    // --- Helper Functions ---

    function showMessage(message, type) {
        messageContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        // Clear message after a few seconds
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    }

    function resetUI() {
        selectedFile = null;
        fileInput.value = ''; // Clear file input
        imagePreview.src = '#';
        previewContainer.style.display = 'none';
        fileNameDisplay.textContent = '';
        uploadButton.disabled = true;
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        messageContainer.innerHTML = '';
        if (resultSection) {
            resultSection.style.display = 'none'; // Hide previous result
        }
    }

    function handleFile(file) {
        resetUI(); // Reset UI before processing new file

        if (!file) {
            showMessage("No file selected.", "error");
            return;
        }

        if (!file.type.startsWith('image/')) {
            showMessage("Please upload an image file (e.g., JPG, PNG).", "error");
            return;
        }

        selectedFile = file;
        fileNameDisplay.textContent = selectedFile.name;
        uploadButton.disabled = false;
        previewContainer.style.display = 'block';

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // --- Event Listeners ---

    // Click to select file
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and drop functionality
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Upload button click
    uploadButton.addEventListener('click', async () => {
        if (!selectedFile) {
            showMessage("Please select an image first.", "warning");
            return;
        }

        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        uploadButton.disabled = true; // Disable during upload
        messageContainer.innerHTML = ''; // Clear previous messages
        if (resultSection) {
            resultSection.style.display = 'none';
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload', true);

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    progressBar.style.width = `${percent}%`;
                    progressText.textContent = `${percent}%`;
                }
            });

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    console.log("XHR Response Text:", xhr.responseText); // Check raw response
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log("Parsed JSON Response:", response); // Check parsed object
                        console.log("Response Success:", response.success); // Check success status
                        console.log("Processed Image URL:", response.processed_image_url); // Check URL
            
                        if (response.success) {
                            console.log("Success path taken. Updating result section.");
                            showMessage(response.message, "success");
                            if (resultSection) {
                                console.log("resultSection element found. Updating innerHTML.");
                                resultSection.innerHTML = `
                                    <h2>Your Processed Image:</h2>
                                    <img src="${response.processed_image_url}" alt="Processed Image">
                                    <a href="${response.processed_image_url}" download>Download Image</a>
                                `;
                                resultSection.style.display = 'block';
                                console.log("resultSection display set to block.");
                            } else {
                                console.log("ERROR: resultSection element not found!");
                            }
                        } else {
                            console.log("Error path taken. Displaying error message.");
                            showMessage(response.message, "error");
                        }
                    } catch (e) {
                        console.error("Error parsing JSON or updating UI:", e);
                        showMessage("An unexpected client-side error occurred. Please try again.", "error");
                    }
                }
            };

            xhr.send(formData);

        } catch (error) {
            uploadButton.disabled = false;
            progressContainer.style.display = 'none';
            showMessage(`An error occurred: ${error.message}`, "error");
        }
    });

    // Initial UI state
    resetUI();
});