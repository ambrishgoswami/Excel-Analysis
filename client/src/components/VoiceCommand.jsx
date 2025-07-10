import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const commandsList = [
  { command: ["go to dashboard", "dashboard"], action: "dashboard" },
  { command: ["go to settings", "settings"], action: "settings" },
  { command: ["logout", "log out"], action: "logout" },
  { command: ["open admin panel", "admin panel"], action: "admin" },
  { command: ["show upload history", "upload history"], action: "uploadHistory" },
];

const VoiceCommand = ({ onCommand }) => {
  const [listening, setListening] = useState(false);
  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (!isListening && transcript) {
      // Check for command match
      const lower = transcript.toLowerCase();
      for (const cmd of commandsList) {
        if (cmd.command.some((c) => lower.includes(c))) {
          onCommand && onCommand(cmd.action);
          break;
        }
      }
      resetTranscript();
    }
    // eslint-disable-next-line
  }, [isListening]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleMicClick = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: false });
      setListening(true);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999 }}>
      <button
        onClick={handleMicClick}
        style={{
          background: listening ? "#1976d2" : "#fff",
          color: listening ? "#fff" : "#1976d2",
          border: "2px solid #1976d2",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
          fontSize: 24,
        }}
        title={listening ? "Listening..." : "Click to speak"}
      >
        <span role="img" aria-label="mic">🎤</span>
      </button>
      {isListening && (
        <div style={{ marginTop: 8, background: "#fff", padding: 8, borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <span>Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceCommand; 