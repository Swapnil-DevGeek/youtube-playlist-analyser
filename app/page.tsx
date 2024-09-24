"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiLink } from "react-icons/fi"; 
import { MdShowChart } from "react-icons/md"; 
import { AiOutlineEye } from "react-icons/ai"; 

interface VideoData {
  title: string;
  views: number;
  thumbnail: string;
}

interface GraphData {
  name: string;
  views: number;
}

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://youtube-playlist-anayser.vercel.app/api/scrape-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlist data");
      }

      const data = await response.json();
      setVideoData(data.videoList);
      setGraphData(data.graphData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-6">
        <Card className="backdrop-blur-md bg-white/10 border border-gray-700 shadow-2xl rounded-xl mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              YouTube Playlist Analyzer
            </CardTitle>
            <CardDescription className="text-lg text-gray-300 mt-2">
              Discover insights from your favorite playlists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="Enter YouTube playlist URL"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  required
                  className="bg-gray-800 text-white border border-gray-600 rounded-lg p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
                />
                <FiLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
              >
                {isLoading ? "Analyzing..." : "Analyze Playlist"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : videoData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-md bg-white/10 border border-gray-700 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <AiOutlineEye className="mr-2" size={28} />
                  Video List
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        
                  {videoData.map((video, index) => (
                    <li key={index} className="flex items-start space-x-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <span className="font-bold text-lg min-w-[24px] text-blue-400">{index + 1}.</span>
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-24 h-auto rounded-md shadow-md" 
                        onError={(e) => {
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image+Available  "; 
                        }} 
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-200">{video.title}</h3>
                        <p className="text-sm text-blue-400">{formatViews(video.views)} views</p>
                      </div>
                    </li>
                  ))}

                </ul>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border border-gray-700 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MdShowChart className="mr-2" size={28} />
                  View Count Graph
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#fff', stroke: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="backdrop-blur-md bg-white/10 border border-gray-700 shadow-xl rounded-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">No Playlist Data Yet</h3>
              <p className="text-gray-300 mb-6">
                Enter a YouTube playlist URL above and click &quot; Analyze Playlist &quot; to see insights about the videos.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Go to Input
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}