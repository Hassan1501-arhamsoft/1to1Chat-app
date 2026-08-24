import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSocket } from "../../../context/SocketContext";
import useAuth from "../../auth/hooks/useAuth";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const [callStatus, setCallStatus] = useState("idle");
  const [incomingCall, setIncomingCall] = useState(null);
  const [callUserId, setCallUserId] = useState(null);
  const [callUserName, setCallUserName] = useState("");

  // ==========================================
  // Create WebRTC connection
  // ==========================================

  const createPeerConnection = () => {
    const peerConnection =
      new RTCPeerConnection();

    peerConnection.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject =
          event.streams[0];
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(
        "WebRTC state:",
        peerConnection.connectionState
      );

      if (
        peerConnection.connectionState ===
        "connected"
      ) {
        setCallStatus("connected");
      }

      if (
        peerConnection.connectionState ===
        "failed"
      ) {
        endLocalCall();
      }

      if (
        peerConnection.connectionState ===
        "disconnected"
      ) {
        endLocalCall();
      }
    };

    peerConnectionRef.current =
      peerConnection;

    return peerConnection;
  };

  // ==========================================
  // Get microphone
  // ==========================================

  const getLocalAudio = async () => {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

    localStreamRef.current = stream;

    return stream;
  };

  // ==========================================
  // Wait for ICE gathering
  // ==========================================

  const waitForIceGathering = (peerConnection) => {
    return new Promise((resolve) => {
      if (
        peerConnection.iceGatheringState ===
        "complete"
      ) {
        resolve();
        return;
      }

      const checkState = () => {
        if (
          peerConnection.iceGatheringState ===
          "complete"
        ) {
          peerConnection.removeEventListener(
            "icegatheringstatechange",
            checkState
          );

          resolve();
        }
      };

      peerConnection.addEventListener(
        "icegatheringstatechange",
        checkState
      );
    });
  };

  // ==========================================
  // Start Call
  // ==========================================

  const startCall = async (
    receiverId,
    receiverName
  ) => {
    if (!socket || !user) {
      return;
    }

    try {
      const currentUserId = user._id || user.id;

      const stream = await getLocalAudio();

      const peerConnection = createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(
          track,
          stream
        );
      });

      const offer =
        await peerConnection.createOffer();

      peerConnection.setLocalDescription(
        offer
      );

      await waitForIceGathering(
        peerConnection
      );

      socket.emit("callUser", {
        callerId: currentUserId,
        receiverId,
        callerName: user.name,
        offer:
          peerConnection.localDescription,
      });

      setCallUserId(receiverId);
      setCallUserName(receiverName);
      setCallStatus("calling");
    } catch (error) {
      console.error(
        "Start Call Error:",
        error
      );

      cleanupCall();
    }
  };

  // ==========================================
  // Accept Call
  // ==========================================

  const acceptCall = async () => {
    if (!socket || !incomingCall) {
      return;
    }

    try {
      const stream = await getLocalAudio();

      const peerConnection =
        createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(
          track,
          stream
        );
      });

       peerConnection.setRemoteDescription(
        incomingCall.offer
      );

      const answer =
        await peerConnection.createAnswer();

       peerConnection.setLocalDescription(
        answer
      );

      await waitForIceGathering(
        peerConnection
      );

      socket.emit("acceptCall", {
        callerId: incomingCall.callerId,
        answer:
          peerConnection.localDescription,
      });

      setCallUserId(
        incomingCall.callerId
      );

      setCallUserName(
        incomingCall.callerName
      );

      setIncomingCall(null);
      setCallStatus("connecting");
    } catch (error) {
      console.error(
        "Accept Call Error:",
        error
      );

      cleanupCall();
    }
  };

  // ==========================================
  // Reject Call
  // ==========================================

  const rejectCall = () => {
    if (!socket || !incomingCall) {
      return;
    }

    socket.emit("rejectCall", {
      callerId: incomingCall.callerId,
    });

    setIncomingCall(null);
    setCallStatus("idle");
  };

  // ==========================================
  // End local call
  // ==========================================

  const endLocalCall = () => {
    cleanupCall();

    setCallStatus("idle");
    setCallUserId(null);
    setCallUserName("");
    setIncomingCall(null);
  };

  // ==========================================
  // End Call
  // ==========================================

  const endCall = () => {
    if (socket && callUserId) {
      socket.emit("endCall", {
        targetUserId: callUserId,
      });
    }
    endLocalCall()
  };

  // ==========================================
  // Cleanup WebRTC
  // ==========================================

  const cleanupCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();

      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
  };

  // ==========================================
  // Socket events
  // ==========================================

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Incoming call
    const handleIncomingCall = ({
      callerId,
      callerName,
      offer,
    }) => {
      setIncomingCall({
        callerId,
        callerName,
        offer,
      });

      setCallStatus("incoming");
    };

    // Caller receives accepted call
    const handleCallAccepted = async ({
      answer,
    }) => {
      if (!peerConnectionRef.current) {
        return;
      }

      await peerConnectionRef.current
        .setRemoteDescription(answer);

      setCallStatus("connecting");
    };

    // Caller receives rejected call
    const handleCallRejected = () => {
      cleanupCall();

      setCallStatus("idle");
      setCallUserId(null);
      setCallUserName("");
    };

    // Other user ended call
    const handleCallEnded = () => {
      cleanupCall();

      setCallStatus("idle");
      setCallUserId(null);
      setCallUserName("");
      setIncomingCall(null);
    };

    // Receiver is offline
    const handleCallFailed = ({ message }) => {
      console.log("Call failed:", message);

      cleanupCall();

      setCallStatus("call failed");
      setCallUserId(null);
      setCallUserName("");

    };

    socket.on(
      "incomingCall",
      handleIncomingCall
    );

    socket.on(
      "callAccepted",
      handleCallAccepted
    );

    socket.on(
      "callRejected",
      handleCallRejected
    );

    socket.on(
      "callEnded",
      handleCallEnded
    );

    socket.on(
      "callFailed",
      handleCallFailed
    );

    return () => {
      socket.off(
        "incomingCall",
        handleIncomingCall
      );

      socket.off(
        "callAccepted",
        handleCallAccepted
      );

      socket.off(
        "callRejected",
        handleCallRejected
      );

      socket.off(
        "callEnded",
        handleCallEnded
      );

      socket.off(
        "callFailed",
        handleCallFailed
      );
    };
  }, [socket]);

  // ==========================================
  // Cleanup on component unmount
  // ==========================================

  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, []);

  return (
    <CallContext.Provider
      value={{
        callStatus,
        incomingCall,
        callUserName,
        remoteAudioRef,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCallContext = () => {
  return useContext(CallContext);
};