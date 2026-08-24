import useCall from "../hooks/useCall";
import "../styles/Call.css";

function CallUI() {
  const {
    callStatus,
    incomingCall,
    callUserName,
    acceptCall,
    rejectCall,
    endCall,
    remoteAudioRef,
  } = useCall();

  // No call
  if (callStatus === "idle") {
    return null;       
  }

  // Incoming call
  if (
    callStatus === "incoming" &&
    incomingCall
  ) {
    return (
      <div className="call-overlay">
        <div className="call-box">
          <h2>Incoming Call</h2>

          <p>
            {incomingCall.callerName} is calling...
          </p>

          <div className="call-buttons">
            <button
              className="reject-button"
              onClick={rejectCall}
            >
              Reject
            </button>

            <button
              className="accept-button"
              onClick={acceptCall}
            >
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
      <div className="call-box">
        <h2>
          {callStatus === "calling"
            ? "Calling..."
            : callStatus === "connecting"
            ? "Connecting..."
            : "Audio Call"}
        </h2>

        <p>{callUserName}</p>

        <audio
          ref={remoteAudioRef}
          autoPlay
        />

        <button
          className="end-button"
          onClick={endCall}
        >
          End Call
        </button>
      </div>
    </div>
  );
}

export default CallUI;