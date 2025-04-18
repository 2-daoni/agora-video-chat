import VideoKit from "@/components/VideoKit";

export default function AgoraPage() {
  return (
    <div>
      <h1 className="text-[28px] font-[700]">Agora 화상채팅 테스트</h1>
      {/* <AgoraVideoCall /> */}
      <VideoKit />
    </div>
  );
}
