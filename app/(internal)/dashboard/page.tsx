"use client"
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import usePost from "@/hooks/usePost";
import useResult from "@/hooks/useResult";
import { FaArrowTurnUp } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import Result from "@/components/Result";
import PostGeneratorSteps from "@/components/PostGeneratorSteps";
import { FaMicrophone } from "react-icons/fa";
import useLanguage from "@/hooks/useLanguage";
import { ChatSidebar } from '@/components/ChatSideBar';

interface Chat {
  id: string;
  title: string;
  input: string;
  response: string;
  createdAt: Date;
}

export default function TwitterPost() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [animatedResponse, setAnimatedResponse] = useState('');
  const [isCodeResponse, setIsCodeResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { post, setPost } = usePost();
  const { result, setResult } = useResult();
  const { language, setLanguage } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/chat/${session?.user?.id}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    if (session?.user) {
      fetchChatHistory();
    }
  }, [session]);

  const detectIfCodeQuery = (text: string): boolean => {
    const codeKeywords = ['code', 'function', 'programming', 'algorithm', 'syntax'];
    return codeKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const animateResponse = async (text: string) => {
    setAnimatedResponse('');
    for (let i = 0; i < text.length; i++) {
      setAnimatedResponse(prev => prev + text[i]);
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post('/api/linkedin/generate', { post, language });
      const responseText = response.data.message;
      setResult(responseText);

      setIsCodeResponse(detectIfCodeQuery(post));
      setResponse(responseText);
      await animateResponse(responseText);

      const chatResponse = await axios.post('/api/chat', {
        userId: session?.user?.id,
        title: post.slice(0, 30) + (post.length > 30 ? '...' : ''),
        input: post,
        response: responseText,
      });
      setChatHistory(prevChats => [chatResponse.data, ...prevChats]);
      setActiveChat(chatResponse.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    setActiveChat(null);
    setPost('');
    setResponse('');
    setAnimatedResponse('');
    setIsCodeResponse(false);
  };

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat.id);
    setPost(chat.input);
    setResponse(chat.response);
    setAnimatedResponse(chat.response);
    setIsCodeResponse(detectIfCodeQuery(chat.input));
  };

  return (
    <main className="flex min-h-screen m-5 p-5">
      <ChatSidebar
        chats={chatHistory}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleChatSelect}
      />
      <div className="flex-1 flex flex-col space-y-8 pt-10 px-4">
        <div className='flex flex-col items-center justify-center gap-2'>
          <Image
            src="/logo.png"
            alt="logo"
            width={64}
            height={64}
            className='rounded-lg border'
          />
          <h2 className="text-black text-3xl font-semibold dark:text-white text-center max-w-3xl">
            {`Hi, ${session?.user?.name || "Guest"}`}
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg text-center">
            Translate languages effortlessly with a smart AI-powered language translator.
          </p>
        </div>
        <div className="w-full relative p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center">
          <Textarea
            ref={textareaRef}
            value={post}
            onChange={(e) => {
              setPost(e.target.value);
              adjustTextareaHeight();
            }}
            placeholder="Type your desired language..."
            className="h-fit text-black dark:text-white w-full bg-transparent focus:outline-none focus:border-none max-h-[300px]"
            rows={1}
          />
          <div className="flex justify-between items-end w-full gap-3 mt-6">
            <Select
              onValueChange={setLanguage}
              defaultValue="English"
            >
              <SelectTrigger className="w-[110px] h-[34px] hover:bg-white/10 transition-all duration-300 text-xs bg-transparent rounded-lg before:bg-opacity-90 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white p-2 truncate">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-row gap-2">
              <button
                className={`bg-transparent rounded-lg before:bg-opacity-5 hover:bg-white/10 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white p-2 transition-all duration-300 ${!post ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleGenerate}
                disabled={!post}
              >
                {isGenerating ? <Spinner size="small" /> : <FaArrowTurnUp className="h-4 w-4" />}
              </button>
              <button
                className={`bg-transparent rounded-lg before:bg-opacity-5 hover:bg-white/10 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white p-2 transition-all duration-300 ${!post ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!post}
              >
                <FaMicrophone className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {result ? (
            <Result />
          ) : (
            <PostGeneratorSteps />
          )}
        </div>
      </div>
    </main>
  );
}