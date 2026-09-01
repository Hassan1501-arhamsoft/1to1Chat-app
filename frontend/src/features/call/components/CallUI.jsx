import { useState, useEffect } from "react";
import useCall from "../hooks/useCall";
import "../styles/Call.css";

// Helper function to format seconds into MM:SS
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function CallUI() {
  const {
  callStatus,
  incomingCall,
  callUserName,
  acceptCall,
  rejectCall,
  endCall,
  remoteAudioRef,
  remoteVideoRef,
  localVideoRef,
  callType,
} = useCall();

  // State to track call duration
  const [callDuration, setCallDuration] = useState(0);

  // Timer logic
  useEffect(() => {
    let timerInterval;

    if (callStatus === "connected") {
      timerInterval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      // Reset timer if the call is not connected
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCallDuration(0);
    }

    // Cleanup interval on unmount or status change
    return () => clearInterval(timerInterval);
  }, [callStatus]);

  // No call
  if (callStatus === "idle") {
    return null;
  }

  // Incoming call
  if (callStatus === "incoming" && incomingCall) {
    return (
      <div className="call-overlay">
        <div className="call-box">
          <h2>Incoming Call</h2>
          <p>{incomingCall.callerName} is calling...</p>
          <div className="call-buttons">
            <button className="reject-button" onClick={rejectCall}>
              Reject
            </button>
            <button className="accept-button" onClick={acceptCall}>
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calling / connecting / connected
  return (
    <div className="call-overlay">
    <div className="call-box" style={{ width: callType === "video" ? '600px' : '320px' }}>
      <h2>
        {callStatus === "calling"
          ? "Calling..."
          : callStatus === "connecting"
          ? "Connecting..."
          : callType === "video" ? "Video Call" : "Audio Call"}
      </h2>

      <p className="call-username">{callUserName}</p>

      {callStatus === "connected" && (
        <div className="call-timer">{formatTime(callDuration)}</div>
      )}

      {/* Render Video or Audio based on callType */}
      {callType === "video" ? (
        <div className="video-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <video ref={localVideoRef} autoPlay muted style={{ width: '250px', background: '#000', borderRadius: '8px' }} />
          <video ref={remoteVideoRef} autoPlay style={{ width: '250px', background: '#000', borderRadius: '8px' }} />
          
        </div>
      ) : (
        <audio ref={remoteAudioRef} autoPlay />
      )}

      <button className="end-button" onClick={endCall}>
        End Call
      </button>
    </div>
  </div>
  );
}

export default CallUI;