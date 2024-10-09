<p align="center"><img src="/src/assets/images/android-chrome-96x96.png"></p>
<h2 align="center">ByeBackground</h2>
<p align="center">Remove image backgrounds effortlessly with this privacy-focused, browser-based tool, requiring only a single click</p>
<p align="center">
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#deploy">Deploy</a> •
    <a href="#license">License</a>
</p>

## About

I needed a simple tool to remove backgrounds from images without compromising on privacy or ease of use.  
I wasn't satisfied with existing solutions - they were either too complicated, lacked features, or came with privacy concerns.  
That's why I created ByeBackground: a powerful, privacy-focused tool that runs entirely in your browser.  
The model used is [BRIA Background Removal v1.4](https://huggingface.co/briaai/RMBG-1.4), one of the most advanced models for background removal.  
This model is released under a Creative Commons license for non-commercial use.

## Features

- ✅ **Easy to Use**: Drag and drop your image, click a button - it's that simple
- ✅ **Respects Original Image Resolution**: Get results with the same resolution as your original image, no paywall for maximum quality
- ✅ **Cutting Edge**: Uses the latest technologies for efficient, privacy-respecting background removal
- ✅ **Economic**: No credits or subscriptions required, access all features without restrictions
- ✅ **Ethical**: Runs entirely in your browser, reducing server load and energy consumption
- ✅ **Privacy-Focused**: Your images never leave your browser, ensuring 100% privacy
- ✅ **Ad-Free & Tracker-Free**: A clean, respectful internet experience

## Deploy

### Install dependencies

First check that you have **Node.js** and **npm** installed on your machine.  
Then, **install PHP dependencies**:  
Install **Node.js dependencies**:  
```bash
npm install
```

### Build assets
Don't forget to **generate the assets**:
```bash
npm run build
```
**NOTE**: You **do not need to transfer** the **`node_modules`** folder **to your server** once the assets have been compiled.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
