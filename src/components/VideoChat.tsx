// components/VideoChat.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const TOKEN = null; // 테스트 용으로 null 가능
const CHANNEL = "testChannel";

const VideoChat = () => {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  console.log("remoteUsers", remoteUsers);
  console.log(APP_ID);

  useEffect(() => {
    const init = async () => {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // 이벤트 핸들링
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          const remoteVideoContainer = document.createElement("div");
          remoteVideoContainer.id = user.uid.toString();
          document
            .getElementById("remote-streams")
            ?.appendChild(remoteVideoContainer);
          remoteVideoTrack.play(remoteVideoContainer);
        }

        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
          remoteAudioTrack.play();
        }

        setRemoteUsers((prev) => [...prev, user]);
      });

      client.on("user-unpublished", (user) => {
        document.getElementById(user.uid.toString())?.remove();
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      // Join and publish
      const uid = await client.join(APP_ID, CHANNEL, TOKEN || null, null);

      const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      const localPlayerContainer = document.createElement("div");
      localPlayerContainer.id = uid.toString();
      localVideoRef.current?.appendChild(localPlayerContainer);
      localTracks[1].play(localPlayerContainer);

      await client.publish(localTracks);
    };

    init();

    return () => {
      const client = clientRef.current;
      if (client) {
        client.leave();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Agora 화상채팅</h2>
      <div className="flex gap-4">
        <div ref={localVideoRef} className="w-1/2 border p-2">
          <p>🧍‍♂️ 내 비디오</p>
        </div>
        <div id="remote-streams" className="w-1/2 border p-2">
          <p>🧑‍🤝‍🧑 상대방</p>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
