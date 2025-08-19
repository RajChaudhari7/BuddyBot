import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from '../assets/user.gif';
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const { userData, setUserData, navigate, backendUrl, getGeminiResponse } = useContext(userDataContext);
  const [isListening, setIsListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);
  const [aiText, setAiText] = useState("");
  const [userText, setUserText] = useState("");
  const [ham, setHam] = useState(false)

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signup");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const speak = (text, lang = "en-US") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          utterance.voice = voices.find((voice) => voice.lang === lang) || voices[0];
          isSpeakingRef.current = true;
          utterance.onend = () => {
            isSpeakingRef.current = false;
          };
          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(loadVoices, 100);
        }
      };
      loadVoices();
    } else {
      console.error("Text-to-speech not supported in this browser.");
    }
  };

  const handleCommand = (data) => {
    console.log("Received data in handleCommand:", data);
    const { type, userInput, response, lang } = data;
    if (response) {
      setAiText(response);
      speak(response, lang);
    }
    switch (type) {
      case "general":
        if (userInput?.toLowerCase().includes("youtube")) {
          window.open(`https://www.youtube.com/`, "_blank");
        } else if (userInput?.toLowerCase().includes("google")) {
          const query = encodeURIComponent(userInput.replace("google", "").trim());
          window.open(`https://www.google.com/search?q=${query}`, "_blank");
        } else if (userInput?.toLowerCase().includes("instagram")) {
          window.open(`https://www.instagram.com/`, "_blank");
        } else if (userInput?.toLowerCase().includes("facebook")) {
          window.open(`https://www.facebook.com/`, "_blank");
        } else if (userInput?.toLowerCase().includes("weather")) {
          window.open(`https://www.google.com/search?q=weather`, "_blank");
        } else if (userInput?.toLowerCase().includes("calculator")) {
          window.open(`https://www.google.com/search?q=calculator`, "_blank");
        }
        break;
      case "google_search":
        if (userInput) {
          const query = encodeURIComponent(userInput);
          window.open(`https://www.google.com/search?q=${query}`, "_blank");
        }
        break;
      case "calculator_open":
        window.open(`https://www.google.com/search?q=calculator`, "_blank");
        break;
      case "instagram_open":
        window.open(`https://www.instagram.com/`, "_blank");
        break;
      case "facebook_open":
        window.open(`https://www.facebook.com/`, "_blank");
        break;
      case "weather_show":
        window.open(`https://www.google.com/search?q=weather`, "_blank");
        break;
      case "youtube_search":
        if (userInput) {
          const query = encodeURIComponent(userInput);
          window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        } else {
          window.open(`https://www.youtube.com/`, "_blank");
        }
        break;
      case "youtube_play":
        if (userInput) {
          const query = encodeURIComponent(userInput);
          window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        }
        break;
      default:
        console.warn(`Unknown command type: ${type}`);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    isRecognitionActiveRef.current = false;
    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognitionActiveRef.current = true;
      setIsListening(true);
    };
    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognitionActiveRef.current = false;
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      if (event.error !== "aborted") {
        isRecognitionActiveRef.current = false;
      }
    };
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);
      setAiText("")
      setUserText(transcript)
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop();
        try {
          const data = await getGeminiResponse(transcript);
          console.log("Data from getGeminiResponse:", data);
          if (data?.response) {
            handleCommand(data);
            setAiText(data.response)
            setUserText("")
          }
        } catch (error) {
          console.error("Error in getGeminiResponse:", error);
        }
      }
    };
    const startRecognition = () => {
      if (!isRecognitionActiveRef.current) {
        recognition.start();
      }
    };
    startRecognition();
    return () => {
      recognition.stop();
      setIsListening(false);
    };
  }, [userData.assistantName, getGeminiResponse]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices);
    };
  }, []);

  useEffect(() => {
    const restartRecognition = () => {
      if (!isSpeakingRef.current && recognitionRef.current && !isRecognitionActiveRef.current) {
        recognitionRef.current.start();
      }
    };
    const interval = setInterval(restartRecognition, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]">

      <CgMenuRight onClick={() => setHam(true)} className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer" />

      <div className={`absolute top-0 w-full h-full bg-[#00000055] backdrop-blur-lg p-[20px] transition-transform flex flex-col gap-[20px] items-start
        ${ham ? 'translate-x-0' : 'translate-x-full'} `}>
        <RxCross1 onClick={() => setHam(false)} className=" text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer" />
        <button
          type="button"
          className=" min-w-[150px] h-[60px] cursor-pointer  bg-white 
        rounded-full  text-black font-semibold text-[19px]"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          type="button"
          className="  min-w-[150px] h-[60px] cursor-pointer bg-white  rounded-full  text-black font-semibold text-[19px] px-[20px] py-[10px]"
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[400px] overflow-auto gap-[20px] flex flex-col ">
          {userData.history?.map((his) => (
            <span className="text-gray-200 text-[18px] mt-[20px] ">{his}</span>
          ))}
        </div>

      </div >

      <button
        type="button"
        className="absolute min-w-[150px] h-[60px] cursor-pointer top-[20px] right-[20px] bg-white hidden lg:block 
        rounded-full mt-[30px] text-black font-semibold text-[19px]"
        onClick={handleLogout}
      >
        Log Out
      </button>
      <button
        type="button"
        className=" hidden lg:block absolute min-w-[150px] h-[60px] cursor-pointer bg-white top-[100px] right-[20px] rounded-full mt-[30px] text-black font-semibold text-[19px] px-[20px] py-[10px]"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img src={userData?.assistantImage} alt="Assistant" className="h-full object-cover" />
      </div>
      <h1 className="text-white text-[18px] font-semibold">I'm {userData?.assistantName}</h1>
      {!aiText && (
        <div className="flex flex-col items-center">
          <img src={userImg} alt="AI Response" className="w-[200px] h-[200px] object-contain" />
          <p className="text-white text-[25px]">{userText}</p>
        </div>
      )}

      {aiText && (
        <div className="flex flex-col items-center">
          <img src={aiImg} alt="AI Response" className="w-[200px] h-[200px] object-contain" />
          <p className="text-white text-[25px]">{aiText}</p>
        </div>
      )}

    </div>
  );
};

export default Home;
