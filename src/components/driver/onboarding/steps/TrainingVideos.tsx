import React, { useState } from "react";
import BreadcrumbStepper from "./BreadcrumbStepper";

const TrainingVideos: React.FC = ({ onNext }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});

  const videos = [
    {
      url: "/video1.mp4",
      quiz: "What was the main point of video 1?",
      options: ["Option A", "Option B", "Option C"],
    },
    {
      url: "/video2.mp4",
      quiz: "What was the main point of video 2?",
      options: ["Option X", "Option Y", "Option Z"],
    },
    // ... other videos
  ];

  const handleVideoEnd = () => {
    setWatchedVideos([...watchedVideos, currentVideo]);
  };

  const handleQuizAnswer = (answer) => {
    setQuizAnswers({ ...quizAnswers, [currentVideo]: answer });
  };

  const handleNextVideo = () => {
    setCurrentVideo(currentVideo + 1);
  };

  const handleSubmit = () => {
    onNext({ watchedVideos, quizAnswers });
  };

  const isQuizComplete = quizAnswers[currentVideo] != null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-2 h-32" />
      <BreadcrumbStepper currentStep={5}/>
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Training Videos</h2>
          <p className="mb-4 text-gray-600">You must watch the videos and answer a question to proceed.</p>

          <div className="mb-4">
            <video
              src={videos[currentVideo].url}
              controls
              autoPlay
              onEnded={handleVideoEnd}
              className="w-full"
            />
          </div>
          {watchedVideos.includes(currentVideo) && (
            <div className="mb-4">
              <p className="mb-2">{videos[currentVideo].quiz}</p>
              {videos[currentVideo].options.map((option, index) => (
                <label key={index} className="mb-2 block">
                  <input
                    type="radio"
                    name={`quiz-${currentVideo}`}
                    value={option}
                    onChange={() => handleQuizAnswer(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {isQuizComplete && (
            <button
              onClick={handleNextVideo}
              disabled={currentVideo >= videos.length - 1}
              className={`w-full rounded-md bg-blue-500 p-2 text-white ${
                currentVideo >= videos.length - 1
                  ? "cursor-not-allowed bg-blue-500 opacity-50"
                  : "bg-blue-500"
              }`}
            >
              Next Video
            </button>
          )}
          {currentVideo >= videos.length - 1 && isQuizComplete && (
            <button
              onClick={handleSubmit}
              className="mt-4 w-full rounded-md bg-blue-500 p-2 text-white"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingVideos;
