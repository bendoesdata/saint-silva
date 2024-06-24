let video;
let classifier;
let interval = 5000; // 5 seconds

function setup() {
    noCanvas();
    // Ensure the container element exists
    let webcamContainer = document.getElementById('webcam-container');
    if (!webcamContainer) {
        console.error('webcam-container element not found');
        return;
    }

    // Create and setup the video capture
    video = createCapture(VIDEO, () => {
        console.log('Video capture started');
    });
    video.size(640, 480);
    video.parent('webcam-container');

    // Load the color classifier model
    classifier = ml5.colorClassifier('ColorClassifier', modelReady);
}

function modelReady() {
    console.log('Color Classifier Model Loaded');
    // Start classifying colors every 5 seconds
    setInterval(classifyColors, interval);
}

function classifyColors() {
    if (classifier) {
        // Capture the current video frame
        video.loadPixels();
        const imageData = video.canvas.getContext('2d').getImageData(0, 0, video.width, video.height);

        // Classify the colors in the image data
        classifier.classify(imageData, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(results);
        });
    } else {
        console.log('Model is not ready yet.');
    }
}
