import "../scss/styles.scss";

import {
    Accordion
} from "bootstrap";

import "masonry-layout";

import {
    AutoModel,
    AutoProcessor,
    env,
    RawImage
} from "@xenova/transformers";

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function displayMobileWarning() {
    const mobileWarning = document.getElementById("mobile-warning");
    if (isMobileDevice()) {
        mobileWarning.style.display = "block";
    } else {
        mobileWarning.style.display = "none";
    }
}

const waitingMessages = [
    "✨ Letting the magic happen ✨",
    "🌟 Processing in progress... 🌟",
    "⏳ Just a bit longer... ⏳",
    "🔮 Conjuring pixels 🔮",
    "🎨 Painting your request 🎨"
];

function changeWaitingMessage() {
    const loadInfo = document.getElementById("loadinfo");
    let messageIndex = 0;
    return setInterval(() => {
        loadInfo.innerHTML = waitingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % waitingMessages.length;
    }, 5000);
}


document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#use-js").style.visibility = "visible";
    displayMobileWarning();
    const dropzoneInput = document.getElementById("dropzone-input");
    const dropzonePreview = document.querySelector(".dropzone-preview");
    const dropzonePreviewImage = document.querySelector(".dropzone-preview-image");
    const dropzonePreviewFilename = document.querySelector(".dropzone-preview-filename");
    const dropzonePreviewButton = document.querySelector(".dropzone-preview-button");
    const dropzonePlaceholder = document.querySelector(".dropzone-placeholder");
    const generateButton = document.getElementById("generate");
    let model, processor;

    const updatePreview = (file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            dropzoneInput.disabled = true;
            dropzonePreview.style.display = "block";
            dropzonePreviewImage.style.display = "block";
            dropzonePreviewImage.style.backgroundImage = `url(${e.target.result})`;
            dropzonePreviewFilename.textContent = file.name;
            dropzonePlaceholder.style.display = "none";
            dropzonePreviewButton.style.display = "block";
            generateButton.classList.remove("disabled");
        };
        reader.readAsDataURL(file);
    };

    dropzoneInput.addEventListener("change", function() {
        if (this.files && this.files[0]) {
            updatePreview(this.files[0]);
        }
    });

    dropzonePreviewButton.addEventListener("click", function() {
        dropzoneInput.value = "";
        dropzoneInput.disabled = false;
        dropzonePreview.style.display = "none";
        dropzonePreviewImage.style.backgroundImage = "none";
        dropzonePreviewImage.style.display = "none";
        dropzonePreviewFilename.textContent = "";
        dropzonePlaceholder.style.display = "block";
        dropzonePreviewButton.style.display = "none";
        generateButton.textContent = "Bye Background!";
        generateButton.classList.add("disabled");
    });

    generateButton.addEventListener("click", async function() {
        if (!model || !processor) {
            document.getElementById("loadinfo").innerHTML = "🌤️ Loading model...";
            showSpinner();

            env.allowLocalModels = true;
            env.allowRemoteModels = false;
            env.localModelPath = "/models";
            env.backends.onnx.wasm.proxy = true;

            model = await AutoModel.from_pretrained("bgdel", {
                config: {
                    model_type: "custom"
                },
            });

            processor = await AutoProcessor.from_pretrained("bgdel", {
                config: {
                    do_normalize: true,
                    do_pad: false,
                    do_rescale: true,
                    do_resize: true,
                    image_mean: [0.5, 0.5, 0.5],
                    feature_extractor_type: "ImageFeatureExtractor",
                    image_std: [1, 1, 1],
                    resample: 2,
                    rescale_factor: 0.00392156862745098,
                    size: {
                        width: 1024,
                        height: 1024
                    },
                }
            });

            removeSpinner();
        }

        if (generateButton.textContent === "Download") {
            downloadImage(dropzonePreviewImage.style.backgroundImage, dropzonePreviewFilename.textContent);
        } else {
            const file = dropzoneInput.files[0];
            if (!file) {
                alert("Please upload an image first.");
                return;
            }

            document.getElementById("loadinfo").innerHTML = waitingMessages[0];
            const messageInterval = changeWaitingMessage();

            showSpinner();

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async function() {
                await predict(reader.result, model, processor)
                    .then((generatedImageURL) => {
                        clearInterval(messageInterval);
                        document.getElementById("loadinfo").innerHTML = "✨ Magic complete! ✨";
                        dropzonePreviewImage.style.backgroundImage = `url(${generatedImageURL})`;
                        generateButton.textContent = "Download";
                        removeSpinner();
                    })
                    .catch((error) => {
                        clearInterval(messageInterval);
                        console.error("Error removing background:", error);
                        removeSpinner();
                        alert("An error occurred during background removal.");
                    });
            };
        }
    });
});

function downloadImage(url, originalFileName) {
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");
    const newFileName = `${baseName}-byebackground.png`;

    const a = document.createElement("a");
    a.href = url.replace(/^url\("(.*)"\)$/, "$1");
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function showSpinner() {
    document.getElementById("main").style.transition = "opacity 0.4s";
    document.getElementById("main").style.opacity = "0.35";
    document.getElementById("main").style.pointerEvents = "none";
    document.getElementsByClassName("spinner-container")[0].style.transition = "opacity 0.4s";
    document.getElementsByClassName("spinner-container")[0].style.visibility = "visible";
    document.getElementsByClassName("spinner-container")[0].style.opacity = "1";
}

function removeSpinner() {
    document.getElementById("main").style.transition = "opacity 0.4s";
    document.getElementById("main").style.opacity = "1";
    document.getElementById("main").style.pointerEvents = "all";
    document.getElementsByClassName("spinner-container")[0].style.transition = "opacity 0.4s";
    document.getElementsByClassName("spinner-container")[0].style.opacity = "0";
    document.getElementsByClassName("spinner-container")[0].style.visibility = "hidden";
}

async function predict(url, model, processor) {
    const image = await RawImage.fromURL(url);

    const {
        pixel_values
    } = await processor(image);

    const {
        output
    } = await model({
        input: pixel_values
    });

    const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(image.width, image.height);

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image.toCanvas(), 0, 0);

    const pixelData = ctx.getImageData(0, 0, image.width, image.height);
    for (let i = 0; i < mask.data.length; ++i) {
        pixelData.data[4 * i + 3] = mask.data[i];
    }
    ctx.putImageData(pixelData, 0, 0);

    const generatedImageUrl = canvas.toDataURL("image/png");

    return generatedImageUrl;
}