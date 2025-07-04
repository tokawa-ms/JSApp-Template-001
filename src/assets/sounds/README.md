# Warning Sound Files

This directory contains audio files for the warning system.

## Required Files:

1. **emergency-beep.mp3** - High-pitch continuous beep sound for emergency alerts
2. **attention-beep.mp3** - Medium-pitch single beep for attention calls
3. **voice-warning.mp3** - Voice message: "Warning: Dangerous expression detected"

## File Specifications:

- **Formats**: MP3, WAV, OGG (for browser compatibility)
- **Duration**: 1-3 seconds recommended
- **File Size**: Maximum 500KB per file
- **Quality**: 128kbps for MP3, 44.1kHz sample rate

## Usage:

These audio files are automatically loaded and played when risk expressions are detected in the conversation monitoring system.

## Implementation Notes:

- Files are preloaded for instant playback
- Volume is controlled by the application settings
- Fallback Web Audio API beep is generated if files are unavailable

## Demo Mode:

In demo mode, the application will function without these files by generating synthetic beep sounds using the Web Audio API.

## Production Setup:

For production deployment, ensure all audio files are properly encoded and tested across target browsers (Chrome, Firefox, Edge).
