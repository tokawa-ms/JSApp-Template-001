/**
 * Voice Monitoring Demo Application
 * For Police Officers - Azure AI Integration
 */

class VoiceMonitoringApp {
    constructor() {
        this.isRecording = false;
        this.recognition = null;
        this.currentSpeakers = new Map();
        this.speakerCount = 0;
        this.transcriptHistory = [];
        this.riskLevel = 'low';
        this.currentLanguage = 'en-US';
        this.warningEnabled = true;
        this.volume = 0.7;
        this.currentSoundType = 'emergency';
        
        // API Configuration - Set your Azure API keys here
        this.apiKeys = {
            speech: 'YOUR_AZURE_SPEECH_API_KEY',
            contentSafety: 'YOUR_AZURE_CONTENT_SAFETY_API_KEY',
            openai: 'YOUR_AZURE_OPENAI_API_KEY'
        };
        
        // Azure Service Endpoints - Replace with your actual endpoints
        this.endpoints = {
            speech: 'https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issuetoken',
            contentSafety: 'https://YOUR_REGION.cognitiveservices.azure.com/contentsafety/text:analyze',
            openai: 'https://YOUR_OPENAI_RESOURCE.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions'
        };
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.updateStatus('ready', 'Ready');
        this.displayInitialMessage();
        
        // Check browser compatibility
        if (!this.checkBrowserSupport()) {
            this.showError('Your browser does not support required features. Please use Chrome, Firefox, or Edge.');
            return;
        }
        
        console.log('Voice Monitoring App initialized successfully');
    }
    
    checkBrowserSupport() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    
    setupEventListeners() {
        // Main control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startMonitoring());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopMonitoring());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearTranscript());
        document.getElementById('summaryBtn').addEventListener('click', () => this.generateSummary());
        
        // Settings
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateLanguageSettings();
        });
        
        document.getElementById('warningToggle').addEventListener('change', (e) => {
            this.warningEnabled = e.target.checked;
        });
        
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            document.getElementById('volumeDisplay').textContent = e.target.value + '%';
        });
        
        document.getElementById('soundSelect').addEventListener('change', (e) => {
            this.currentSoundType = e.target.value;
        });
        
        document.getElementById('testSoundBtn').addEventListener('click', () => this.testWarningSound());
    }
    
    displayInitialMessage() {
        const transcriptArea = document.getElementById('transcriptArea');
        transcriptArea.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <div class="text-lg mb-4">🎤 Voice Monitoring System</div>
                <div class="space-y-2">
                    <p>1. Select recognition language (English/Japanese)</p>
                    <p>2. Configure audio warning settings</p>
                    <p>3. Click "Start" to begin monitoring</p>
                    <p>4. Use "Summary" to analyze conversations</p>
                </div>
                <div class="mt-4 text-sm text-blue-600">
                    💡 Demo Mode: Configure API keys in script.js for full functionality
                </div>
            </div>
        `;
    }
    
    async startMonitoring() {
        try {
            this.updateStatus('processing', 'Initializing...');
            
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Initialize speech recognition
            this.initializeSpeechRecognition();
            
            // Start recording
            this.recognition.start();
            this.isRecording = true;
            
            // Update UI
            this.updateControlButtons();
            this.updateStatus('recording', 'Recording');
            this.clearTranscriptArea();
            
            console.log('Voice monitoring started');
            
        } catch (error) {
            console.error('Error starting monitoring:', error);
            this.showError('Failed to start monitoring. Please check microphone permissions.');
            this.updateStatus('ready', 'Ready');
        }
    }
    
    stopMonitoring() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
            this.isRecording = false;
            this.updateControlButtons();
            this.updateStatus('ready', 'Ready');
            
            console.log('Voice monitoring stopped');
        }
    }
    
    clearTranscript() {
        this.transcriptHistory = [];
        this.currentSpeakers.clear();
        this.speakerCount = 0;
        this.updateSpeakerCount();
        this.updateRiskLevel('low');
        this.clearTranscriptArea();
        this.clearSummaryArea();
        
        console.log('Transcript cleared');
    }
    
    clearTranscriptArea() {
        const transcriptArea = document.getElementById('transcriptArea');
        transcriptArea.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <div class="text-lg mb-2">🎤 Listening...</div>
                <div class="text-sm">Speak clearly to begin transcription</div>
            </div>
        `;
    }
    
    clearSummaryArea() {
        const summaryArea = document.getElementById('summaryArea');
        summaryArea.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                No summary available.<br>
                Click "Generate Summary" to analyze the conversation.
            </div>
        `;
    }
    
    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;
        
        // Event handlers
        this.recognition.onresult = (event) => this.handleSpeechResult(event);
        this.recognition.onerror = (event) => this.handleSpeechError(event);
        this.recognition.onend = () => this.handleSpeechEnd();
        
        console.log(`Speech recognition initialized for language: ${this.currentLanguage}`);
    }
    
    async handleSpeechResult(event) {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.trim();
            if (transcript) {
                // Simulate speaker identification (in real implementation, use Azure Speaker Recognition)
                const speakerId = this.identifySpeaker(transcript);
                const timestamp = new Date().toLocaleTimeString();
                
                // Add to transcript history
                const transcriptEntry = {
                    id: Date.now(),
                    speakerId,
                    transcript,
                    timestamp,
                    isRisk: false,
                    riskParts: []
                };
                
                this.transcriptHistory.push(transcriptEntry);
                
                // Display transcript
                this.displayTranscript(transcriptEntry);
                
                // Analyze content safety (simulated)
                await this.analyzeContentSafety(transcriptEntry);
                
                console.log(`Transcript: [Speaker ${speakerId}] ${transcript}`);
            }
        }
    }
    
    handleSpeechError(event) {
        console.error('Speech recognition error:', event.error);
        
        switch (event.error) {
            case 'no-speech':
                // Normal case, don't show error
                break;
            case 'network':
                this.showError('Network error. Please check your internet connection.');
                break;
            case 'not-allowed':
                this.showError('Microphone access denied. Please allow microphone access.');
                break;
            default:
                this.showError(`Speech recognition error: ${event.error}`);
        }
    }
    
    handleSpeechEnd() {
        if (this.isRecording) {
            // Restart recognition to maintain continuous listening
            setTimeout(() => {
                if (this.isRecording) {
                    this.recognition.start();
                }
            }, 100);
        }
    }
    
    identifySpeaker(transcript) {
        // Simple speaker identification simulation
        // In real implementation, use Azure Speaker Recognition API
        const hash = this.hashCode(transcript.substring(0, 10));
        const speakerIndex = Math.abs(hash) % 5 + 1;
        
        if (!this.currentSpeakers.has(speakerIndex)) {
            this.currentSpeakers.set(speakerIndex, true);
            this.speakerCount = this.currentSpeakers.size;
            this.updateSpeakerCount();
        }
        
        return speakerIndex;
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    
    displayTranscript(entry) {
        const transcriptArea = document.getElementById('transcriptArea');
        
        // Remove initial message if present
        if (transcriptArea.children.length === 1 && transcriptArea.children[0].textContent.includes('Listening...')) {
            transcriptArea.innerHTML = '';
        }
        
        const entryElement = document.createElement('div');
        entryElement.className = `transcript-entry speaker-${entry.speakerId}`;
        entryElement.dataset.entryId = entry.id;
        
        entryElement.innerHTML = `
            <span class="speaker-label">Speaker ${entry.speakerId}</span>
            <span class="timestamp">${entry.timestamp}</span>
            <div class="transcript-text">${entry.transcript}</div>
        `;
        
        transcriptArea.appendChild(entryElement);
        transcriptArea.scrollTop = transcriptArea.scrollHeight;
    }
    
    async analyzeContentSafety(entry) {
        // Simulate content safety analysis
        // In real implementation, call Azure Content Safety API
        
        try {
            this.updateStatus('processing', 'Analyzing...');
            
            // Simulate API delay
            await this.sleep(500);
            
            // Simple risk detection simulation
            const riskKeywords = [
                'kill', 'murder', 'violence', 'attack', 'weapon', 'bomb', 'threat',
                'drug', 'cocaine', 'heroin', 'meth', 'deal', 'selling',
                '殺す', '暴力', '脅迫', '武器', '爆弾', '薬物', '麻薬'
            ];
            
            const transcript = entry.transcript.toLowerCase();
            const riskFound = riskKeywords.some(keyword => transcript.includes(keyword.toLowerCase()));
            
            if (riskFound) {
                entry.isRisk = true;
                await this.highlightRiskText(entry);
                this.updateRiskLevel('high');
                
                if (this.warningEnabled) {
                    this.playWarningSound();
                }
            }
            
            this.updateStatus('recording', 'Recording');
            
        } catch (error) {
            console.error('Content safety analysis error:', error);
        }
    }
    
    async highlightRiskText(entry) {
        // Simulate GPT-4o-mini analysis for specific risk text identification
        // In real implementation, call Azure OpenAI API
        
        const entryElement = document.querySelector(`[data-entry-id="${entry.id}"] .transcript-text`);
        if (!entryElement) return;
        
        // Simple risk word highlighting simulation
        const riskKeywords = [
            'kill', 'murder', 'violence', 'attack', 'weapon', 'bomb', 'threat',
            'drug', 'cocaine', 'heroin', 'meth', 'deal', 'selling',
            '殺す', '暴力', '脅迫', '武器', '爆弾', '薬物', '麻薬'
        ];
        
        let highlightedText = entry.transcript;
        
        riskKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, (match) => {
                return `<span class="risk-highlight" title="High Risk Expression Detected">
                    ${match}
                    <div class="tooltip">⚠️ Risk detected: Potentially dangerous expression</div>
                </span>`;
            });
        });
        
        entryElement.innerHTML = highlightedText;
        
        // Add click handlers for risk highlights
        entryElement.querySelectorAll('.risk-highlight').forEach(element => {
            element.addEventListener('click', () => {
                this.showRiskDetails(entry, element.textContent);
            });
        });
    }
    
    async generateSummary() {
        if (this.transcriptHistory.length === 0) {
            this.showError('No conversation data available for summary generation.');
            return;
        }
        
        try {
            this.showLoading(true);
            this.updateStatus('processing', 'Generating Summary...');
            
            // Simulate OpenAI API call for summary generation
            await this.sleep(2000);
            
            const summary = this.generateMockSummary();
            this.displaySummary(summary);
            
            this.showLoading(false);
            this.updateStatus('recording', this.isRecording ? 'Recording' : 'Ready');
            
        } catch (error) {
            console.error('Summary generation error:', error);
            this.showError('Failed to generate summary. Please try again.');
            this.showLoading(false);
        }
    }
    
    generateMockSummary() {
        const riskEntries = this.transcriptHistory.filter(entry => entry.isRisk);
        const totalEntries = this.transcriptHistory.length;
        const participantCount = this.speakerCount;
        
        return {
            overview: `Conversation analysis completed. ${totalEntries} statements analyzed from ${participantCount} participants.`,
            riskAssessment: riskEntries.length > 0 ? 'HIGH' : 'LOW',
            riskCount: riskEntries.length,
            mainTopics: ['General conversation', 'Various topics discussed'],
            recommendations: riskEntries.length > 0 ? 
                ['Immediate attention required', 'Consider escalation', 'Monitor closely'] :
                ['Continue standard monitoring', 'No immediate action required'],
            timestamp: new Date().toLocaleString()
        };
    }
    
    displaySummary(summary) {
        const summaryArea = document.getElementById('summaryArea');
        summaryArea.innerHTML = `
            <div class="space-y-4">
                <div class="summary-section">
                    <div class="summary-title">📊 Overview</div>
                    <p class="text-sm">${summary.overview}</p>
                </div>
                
                <div class="summary-section">
                    <div class="summary-title">⚠️ Risk Assessment</div>
                    <div class="flex items-center space-x-2">
                        <span class="risk-indicator ${summary.riskAssessment.toLowerCase()}">${summary.riskAssessment}</span>
                        <span class="text-sm text-gray-600">(${summary.riskCount} risk events detected)</span>
                    </div>
                </div>
                
                <div class="summary-section">
                    <div class="summary-title">💭 Main Topics</div>
                    <ul class="text-sm space-y-1">
                        ${summary.mainTopics.map(topic => `<li>• ${topic}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="summary-section">
                    <div class="summary-title">📋 Recommendations</div>
                    <ul class="text-sm space-y-1">
                        ${summary.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="text-xs text-gray-500 mt-4">
                    Generated: ${summary.timestamp}
                </div>
            </div>
        `;
    }
    
    playWarningSound() {
        if (!this.warningEnabled) return;
        
        const soundMap = {
            'emergency': 'emergencySound',
            'attention': 'attentionSound',
            'voice': 'voiceSound'
        };
        
        const audioId = soundMap[this.currentSoundType] || 'emergencySound';
        const audio = document.getElementById(audioId);
        
        if (audio) {
            audio.volume = this.volume;
            audio.play().catch(error => {
                console.warn('Warning sound playback failed:', error);
                // Fallback: Create beep sound using Web Audio API
                this.createBeepSound();
            });
        } else {
            this.createBeepSound();
        }
    }
    
    createBeepSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // 800 Hz beep
            gainNode.gain.value = this.volume * 0.3; // Reduce volume for beep
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5); // 0.5 second beep
            
        } catch (error) {
            console.warn('Web Audio API not available:', error);
        }
    }
    
    testWarningSound() {
        this.playWarningSound();
    }
    
    updateLanguageSettings() {
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage;
        }
        console.log(`Language changed to: ${this.currentLanguage}`);
    }
    
    updateControlButtons() {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        startBtn.disabled = this.isRecording;
        stopBtn.disabled = !this.isRecording;
    }
    
    updateStatus(status, text) {
        const indicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        indicator.className = `w-3 h-3 rounded-full status-${status}`;
        statusText.textContent = text;
    }
    
    updateSpeakerCount() {
        document.getElementById('speakerCount').textContent = `Speakers: ${this.speakerCount}`;
    }
    
    updateRiskLevel(level) {
        this.riskLevel = level;
        const riskElement = document.getElementById('riskLevel');
        riskElement.textContent = `Risk Level: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
        riskElement.className = `text-sm text-gray-600 risk-${level}`;
    }
    
    validateApiKeys() {
        // Check if API keys are configured (not placeholder values)
        const hasValidKeys = this.apiKeys.speech !== 'YOUR_AZURE_SPEECH_API_KEY' && 
                           this.apiKeys.contentSafety !== 'YOUR_AZURE_CONTENT_SAFETY_API_KEY' && 
                           this.apiKeys.openai !== 'YOUR_AZURE_OPENAI_API_KEY' &&
                           this.apiKeys.speech && this.apiKeys.contentSafety && this.apiKeys.openai;
        
        if (!hasValidKeys) {
            console.warn('Demo mode: Operating with placeholder API keys. Real Azure services are not connected.');
            console.info('To connect to Azure services, replace placeholder values in script.js with your actual API keys.');
        }
        
        return true; // Always allow operation in demo mode
    }
    
    showRiskDetails(entry, riskText) {
        alert(`⚠️ Risk Alert\n\nDetected Risk: "${riskText}"\nSpeaker: ${entry.speakerId}\nTime: ${entry.timestamp}\n\nThis expression has been flagged as potentially dangerous. Consider immediate action.`);
    }
    
    showError(message) {
        alert(`❌ Error: ${message}`);
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceApp = new VoiceMonitoringApp();
    
    // Add demo data for testing
    if (window.location.search.includes('demo=true')) {
        setTimeout(() => {
            window.voiceApp.addDemoData();
        }, 1000);
    }
});

// Demo data for testing purposes
VoiceMonitoringApp.prototype.addDemoData = function() {
    const demoEntries = [
        {
            id: Date.now() - 3000,
            speakerId: 1,
            transcript: "Hello, how are you doing today?",
            timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
            isRisk: false,
            riskParts: []
        },
        {
            id: Date.now() - 2000,
            speakerId: 2,
            transcript: "I'm fine, thanks for asking.",
            timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
            isRisk: false,
            riskParts: []
        },
        {
            id: Date.now() - 1000,
            speakerId: 1,
            transcript: "That's a dangerous weapon you have there.",
            timestamp: new Date(Date.now() - 1000).toLocaleTimeString(),
            isRisk: true,
            riskParts: ['weapon']
        }
    ];
    
    this.transcriptHistory = demoEntries;
    this.speakerCount = 2;
    this.currentSpeakers.set(1, true);
    this.currentSpeakers.set(2, true);
    
    const transcriptArea = document.getElementById('transcriptArea');
    transcriptArea.innerHTML = '';
    
    demoEntries.forEach(entry => {
        this.displayTranscript(entry);
        if (entry.isRisk) {
            this.highlightRiskText(entry);
        }
    });
    
    this.updateSpeakerCount();
    this.updateRiskLevel('high');
    
    console.log('Demo data loaded');
};
