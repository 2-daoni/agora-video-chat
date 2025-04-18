"use client";
import AgoraUIKit from "agora-react-uikit";
import React, { useState } from "react";

const VideoKit = () => {
  const [videoCall, setVideoCall] = useState(true);

  const rtcProps = {
    appId: "de2850fcc60747b4808aefc7d5af7d98",
    channel: "test-channel",
    token: null,
  };

  const callbacks = {
    EndCall: () => {
      setTimeout(() => {
        setVideoCall(false);
      });
    },
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {videoCall ? (
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      ) : (
        <p className="text-white">연결 실패</p>
      )}
    </div>
  );
};

export default VideoKit;
