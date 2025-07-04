# Conversation Monitoring Demo Application Specifications for Police Officers

## 1. Project Overview

### 1.1 Purpose

This application is a demonstration version of a conversation monitoring and analysis tool designed to support police officers' duties. It provides real-time transcription of multi-speaker conversations and automatically detects and alerts on potential criminal risks, assisting police officers in situational assessment.

### 1.2 Target Users

- Police Officers
- Police Station Administrators
- Security Personnel

### 1.3 Technical Positioning

- Frontend-only static web application
- Directly executable in browsers
- Integration with Azure AI services

## 2. Functional Requirements

### 2.1 Speech Transcription Functionality

- High-precision speech recognition using **Azure Speech Service**
- Support for simultaneous multi-speaker recognition
- Real-time streaming processing
- Multi-language speech recognition support (English/Japanese)

#### 2.1.0 Language Selection Functionality

- Dynamic switching of speech recognition target language
- Supported languages: English (en-US), Japanese (ja-JP)
- Default language: English (en-US)
- Real-time language change through settings UI

#### 2.1.1 Diarization Functionality

- Automatic identification of multiple speakers
- Color-coded display for each speaker
- Automatic assignment of speaker labels (Speaker 1, Speaker 2...)
- Visual separation display when speakers change

### 2.2 Content Safety Analysis Functionality

- High-precision risk assessment using **Azure Content Safety**
- Detection of violent expressions, threats, and illegal activity-related expressions
- Graduated risk level evaluation (Low, Medium, High)

#### 2.2.1 Risk Detection Targets

- Violent expressions (physical violence, intimidation)
- Threat and extortion-related expressions
- References to illegal drugs
- Conversations about criminal planning
- Harassment-related expressions

### 2.3 High-Risk Expression Visualization Functionality

- Detailed analysis using **Azure OpenAI GPT-4o-mini**
- Identification of parts determined to be high-risk
- Red highlight display of relevant text
- One-click detailed risk display

#### 2.3.1 Highlight Display Specifications

- Background color: Red (#ff4444)
- Text color: White (#ffffff)
- Blinking effect for attention
- Tooltip display on hover

#### 2.3.2 Audio Warning Functionality

- Automatic audio alert when high-risk is detected
- Customizable warning sound files
- Volume adjustment functionality (0-100%)
- Warning sound on/off toggle
- Multiple warning sound pattern selection

##### 2.3.2.1 Warning Sound File Specifications

- Supported formats: MP3, WAV, OGG
- Recommended audio length: 1-3 seconds
- File size limit: 500KB or less
- Storage location: `src/assets/sounds/` directory
- Default warning sound: `warning-alert.mp3`

##### 2.3.2.2 Warning Sound Patterns

- **Emergency Alert**: High-pitch continuous beep sound
- **Attention Call**: Medium-pitch single beep
- **Custom**: User-specified audio file
- **Voice Guidance**: Audio messages like "Warning: Dangerous expression detected"

### 2.4 Situation Summary Functionality

- Automatic summary generation using **Azure OpenAI GPT-4o-mini**
- Conversation key point extraction
- Comprehensive risk level evaluation
- Recommended action suggestions

#### 2.4.1 Summary Content

- Number of conversation participants
- Main topics
- Detected risk elements
- Chronological situation changes
- Recommended responses for police officers

## 3. Technical Specifications

### 3.1 Frontend Technology Stack

- **HTML5**: Semantic markup for structuring
- **Tailwind CSS**: Responsive design and utility classes
- **JavaScript ES6**: Utilization of modern JavaScript features
- **Web Audio API**: Implementation of audio warning functionality
- **CDN Distribution**: Minimization of external dependencies

### 3.1.1 Audio Functionality Technical Details

- **Audio Element**: Audio playback using HTML5 Audio tag
- **Volume Control**: Dynamic volume adjustment via JavaScript
- **File Management**: Audio file management as static assets
- **Preload Function**: High-speed playback through preloading of warning sounds

### 3.1.2 Language Functionality Technical Details

- **Language Code Management**: ISO 639-1 compliant language codes
- **Dynamic Language Switching**: Azure Speech API language parameter changes
- **UI Multilingualization**: Fixed English, multilingual support only for language selection UI
- **Settings Storage**: Language setting retention via sessionStorage

### 3.2 Azure AI Service Integration

- **Azure Speech Service**
  - Speech-to-Text API
  - Speaker Recognition API
  - Multi-language support (en-US, ja-JP)
  - Real-time streaming
- **Azure Content Safety**
  - Text Analysis API
  - Multi-language content analysis
  - Custom classification functionality
- **Azure OpenAI Service**
  - GPT-4o-mini model
  - Multi-language text analysis and summary generation

### 3.3 Browser Requirements

- Chrome 90 or higher
- Firefox 88 or higher
- Edge 90 or higher
- Microphone access permission required

## 4. User Interface Design

### 4.1 Main Screen Layout

```
┌─────────────────────────────────────────────────────────┐
│                      Header                             │
│  [Voice Monitoring Demo - For Police Officers]          │
├─────────────────────────────────────────────────────────┤
│  API Configuration Panel                                │
│  [Speech API Key] [Content Safety Key] [OpenAI Key]     │
├─────────────────────────────────────────────────────────┤
│  Control Panel                                          │
│  [Start] [Stop] [Clear] [Generate Summary]              │
│  Language: [English/Japanese] Audio: [Warning ON/OFF] [Volume] [Sound] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Transcript Display Area                                │
│  (Speaker color-coding, risk areas highlighted in red)  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Situation Summary Panel                                │
│  (AI-generated summary, risk assessment, recommended actions) │
└─────────────────────────────────────────────────────────┘
```

### 4.1.1 UI Language Display Specifications

- **Display Language**: English only
- **Buttons/Labels**: All in English
- **Messages/Notifications**: English display
- **Configuration Items**: Options displayed in English

### 4.2 Color Palette

- **Primary**: #1e40af (Police Blue)
- **Secondary**: #6b7280 (Gray)
- **Warning**: #ef4444 (Red)
- **Success**: #10b981 (Green)
- **Background**: #f9fafb (Light Gray)

### 4.3 Responsive Design

- Desktop: 1200px and above
- Tablet: 768px - 1199px
- Mobile: 767px and below

## 5. Security Requirements

### 5.1 API Key Management

- Dynamic input method in UI
- Temporary storage in session storage
- Automatic clearing on page reload

### 5.2 Audio Data Protection

- Local processing of audio data
- Prohibition of persistent storage on external servers
- Automatic deletion at session end

### 5.3 Privacy Protection

- Automatic masking of personal information
- Explicit consent before recording starts
- Transparency in data processing

## 6. Performance Requirements

### 6.1 Real-time Performance

- Speech recognition latency: Within 2 seconds
- Risk assessment response time: Within 3 seconds
- UI update frequency: 500ms intervals

### 6.2 Accuracy Requirements

- Speech recognition accuracy: 90% or higher
- Speaker identification accuracy: 85% or higher
- Risk detection accuracy: 95% or higher

## 7. Error Handling

### 7.1 Network Errors

- Retry functionality when Azure API connection fails
- Detection and notification of offline status
- Gradual feature degradation

### 7.2 Audio Input Errors

- Alternative measures when microphone access is denied
- Warning display when audio quality degrades
- Automatic application of noise reduction processing

### 7.3 User Errors

- Guidance when invalid API keys are entered
- Visual feedback when required fields are not entered
- Step-by-step operation guide

## 8. Testing Requirements

### 8.1 Functional Testing

- Verification of integration with each Azure API
- Cross-browser compatibility testing
- Operation confirmation in different audio environments

### 8.2 Performance Testing

- Stability during long-term continuous use
- Processing capability when multiple speakers speak simultaneously
- Memory usage monitoring

### 8.3 Security Testing

- Verification of proper API key protection
- Resistance to XSS/CSRF attacks
- Data leakage risk assessment

## 9. Operational Requirements

### 9.1 Deployment

- Direct distribution of static files
- High-speed distribution via CDN
- Cache strategy optimization

### 9.2 Maintainability

- Easy maintenance through modular design
- Detailed log output functionality
- Externalization of configuration

### 9.3 Scalability

- Preparation for new language support
- Foundation for integration with additional AI services
- Custom warning rule configuration functionality

## 10. User Guide

### 10.1 Initial Setup

1. Obtain and configure Azure Speech Service API key
2. Obtain and configure Azure Content Safety API key
3. Obtain and configure Azure OpenAI Service API key
4. Configure microphone access permissions

### 10.2 Basic Operations

1. Enter API keys
2. Select speech recognition language (English/Japanese, Default: English)
3. Adjust audio warning settings (optional)
4. Start monitoring with the "Start" button
5. Real-time conversation confirmation
6. Response to warning displays and audio alerts
7. Situation assessment with "Generate Summary"

### 10.3 Language Settings

- **Speech Recognition Language**: English (en-US) / Japanese (ja-JP)
- **UI Display Language**: English (fixed)
- **Default Setting**: English
- **Dynamic Change**: Language switching possible even during monitoring

### 10.4 Audio Warning Settings

- Warning sound on/off toggle
- Volume level adjustment (0-100%)
- Warning sound pattern selection
- Custom audio file upload
- Warning sound test playback functionality

### 10.5 Advanced Usage

- Adjustment of custom warning thresholds
- Speaker identification accuracy improvement settings
- Summary generation parameter adjustment

## 11. Limitations

### 11.1 Technical Limitations

- Internet connection required
- Operation limited to modern browsers
- Maximum simultaneous processable speakers: 10

### 11.2 Usage Limitations

- Limited to demonstration purposes
- Actual investigation use requires separate consideration
- Legal responsibility borne by the user

## 12. Future Expansion Plans

### 12.1 Short-term Plans (Within 3 months)

- Implementation of multilingual support
- Customizable warning rules
- Audio quality improvement features

### 12.2 Medium-term Plans (Within 6 months)

- Addition of emotion analysis functionality
- Automatic report generation functionality
- Database integration functionality

### 12.3 Long-term Plans (Within 1 year)

- Machine learning model customization
- Real-time translation functionality
- Mobile app version development
