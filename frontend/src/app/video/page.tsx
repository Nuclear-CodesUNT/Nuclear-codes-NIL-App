"use client";

import { useEffect, useState } from "react";

type Video = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
};

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/videos")
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading videos...</p>;

  // 🔥 Page changes depending on DB content
  if (videos.length === 0) {
    return <p>No videos uploaded yet.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Videos</h1>
      {videos.map(video => (
        <div key={video._id} style={{ marginBottom: "30px" }}>
          <h2>{video.title}</h2>
          {video.description && <p>{video.description}</p>}
          <video width="600" controls src={video.videoUrl} />
        </div>
      ))}
    </div>
  );
}
