# ViSpeak | Eye-Controlled Communicator

A full-stack web app that lets people with paralysis speak with their eyes. Control commands just by looking at them.

## What It Does

It uses your device's camera to track your eye movements in real-time, allowing you to select and speak commands without lifting a finger. It's designed to be a reliable and intuitive communication bridge for patients with total paralysis.

## Features

👁️ Real-time iris tracking using MediaPipe  
🗣️ Browser-based Text-to-Speech (TTS) for instant audio feedback  
✍️ Fully customizable commands to suit any language or need  
💾 Saves your preferences locally so your setup is always ready  
📱 Responsive and mobile-friendly for use on a tablet or phone  
🎨 Sleek, native-app-like design with a calming wooden theme  

## How to Use

1.  Open the app in a modern browser (Chrome, Edge, Firefox are recommended).
2.  Allow camera access when prompted.
3.  Look at a command on the grid. Hold your gaze for 1.5 seconds to select and speak it.
4.  (For caregivers) To customize a command, double-click it on a desktop or long-press it on a mobile device.

## Tech Stack

- **Backend**: FastAPI (Python) - Serves the application and initial default commands.
- **Frontend**:
  - Tailwind CSS - For that sleek, wooden, native-app look.
  - Alpine.js - Handles all interactivity and state management like magic.
  - HTMX - For modern, fast interactions without writing a lot of JavaScript.
- **Eye Tracking**: MediaPipe Web - The powerhouse that makes real-time iris tracking in the browser possible.
- **Icons**: Google Material Icons - For a clean, understandable UI.

## Disclaimer

This application is an assistive technology tool designed to aid communication. The accuracy of eye tracking and command selection can vary based on lighting, camera quality, and user positioning. Please ensure it is set up correctly and supervise its use to ensure effective communication.
