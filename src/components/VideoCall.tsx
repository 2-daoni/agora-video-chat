/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "de2850fcc60747b4808aefc7d5af7d98";
const CHANNEL = "test-channel";
const TOKEN = null;

const AgoraVideoCall = () => {
  const [joined, setJoined] = useState(false);
  const client = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const localVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUserPublished = async (
      user: any,
      mediaType: "audio" | "video" | "datachannel"
    ) => {
      await client.current.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoContainer = document.createElement("div");
        remoteVideoContainer.id = user.uid.toString();
        remoteVideoContainer.style.width = "400px";
        remoteVideoContainer.style.height = "300px";
        remoteVideoContainer.style.background = "#000";
        document
          .getElementById("remote-container")
          ?.appendChild(remoteVideoContainer);
        user.videoTrack?.play(remoteVideoContainer);
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    };

    client.current.on("user-published", handleUserPublished);

    return () => {
      client.current.off("user-published", handleUserPublished);
    };
  }, []);

  useEffect(() => {
    // 연결 버튼 클릭, 채널에 접속할 때 실행
    if (joined) {
      const joinChannel = async () => {
        const uid = await client.current.join(
          APP_ID,
          CHANNEL,
          TOKEN || null,
          null
        );
        console.log("uid", uid);

        const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
        if (localVideoRef.current) {
          localTrack[1].play(localVideoRef.current);
        }
        await client.current.publish(localTrack);

        // 이미 publish된 유저 수동 처리
        client.current.remoteUsers.forEach(async (user) => {
          await client.current.subscribe(user, "video");
          const remoteVideoContainer = document.createElement("div");
          remoteVideoContainer.id = user.uid.toString();
          remoteVideoContainer.style.width = "400px";
          remoteVideoContainer.style.height = "300px";
          remoteVideoContainer.style.background = "#000";
          document
            .getElementById("remote-container")
            ?.appendChild(remoteVideoContainer);
          user.videoTrack?.play(remoteVideoContainer);
        });
      };
      joinChannel();
    }
  }, [joined]);

  return (
    <div>
      <button onClick={() => setJoined(true)}>연결</button>
      {/* 로컬 비디오 영역 */}
      <div
        ref={localVideoRef}
        style={{
          width: "400px",
          height: "300px",
          background: "#000",
          marginBottom: "16px",
          border: "1px",
          borderColor: "white",
        }}
      />
      <div id="remote-container" />
    </div>
  );
};

export default AgoraVideoCall;
