const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropArea.addEventListener('dragover', preventDefaults);
dropArea.addEventListener('dragenter', preventDefaults);
dropArea.addEventListener('dragleave', preventDefaults);
dropArea.addEventListener('drop', handleDrop);
dropArea.addEventListener('dragover', () => {
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', uploadFile);

function handleDrop(e) {
    e.preventDefault();
    dropArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;

    if (files.length == 0) {
        return;
    }

    fileInput.files = files;
    fileInput.dispatchEvent(new Event('change'));
}

function uploadFile() {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3001/upload');

    xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
            const progressPercentage = (event.loaded / event.total) * 100;

            dropArea.textContent = `${progressPercentage.toFixed(2)}%`;
        }
    });

    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            dropArea.textContent = 'File uploaded correctly!';
        } else {
            dropArea.textContent = 'Unable to upload file. Drag and drop to retry.';
        }
    });

    const formData = new FormData();

    formData.append('file', fileInput.files[0]);

    xhr.send(formData);
}
