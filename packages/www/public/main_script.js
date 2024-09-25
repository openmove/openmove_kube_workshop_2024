/* eslint-disable */
const REDIRECT_DELAY = 2000;
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
    const url = `/upload`;
    const formData = new FormData();

    xhr.open('POST', url);

    xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
            const progressPercentage = (event.loaded / event.total) * 100;

            dropArea.textContent = `${progressPercentage.toFixed(2)}%`;
        }
    });

    xhr.addEventListener('error', () => {
        dropArea.textContent = 'Unable to upload file. Drag and drop to retry.';
    });

    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            dropArea.textContent = 'File uploaded correctly! Loading...';
            handleUploadSuccess(xhr);
        } else {
            dropArea.textContent = 'Unable to upload file. Drag and drop to retry.';
        }
    });

    formData.append('file', fileInput.files[0]);

    xhr.send(formData);
}

function handleUploadSuccess(xhr) {
    const responseBody = xhr.responseText;
    const data = JSON.parse(responseBody);
    const processId = data.processId;
    const url = `/download/${processId}`;

    setTimeout(() => {
        location.href = url;
    }, REDIRECT_DELAY);
}
