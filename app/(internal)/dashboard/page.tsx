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


export default function TwitterPost() {

  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
  }, [session]);

  const { post, setPost } = usePost();
  const { result, setResult } = useResult();
  const { language, setLanguage } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };



  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post('/api/linkedin/generate', { post, language });
      setResult(response.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="flex flex-col space-y-8 pt-10">
      <div className='flex flex-col items-center justify-center gap-2'>
        <Image src={"/logo.png"} alt="logo" width={500} height={500} className='rounded-lg h-16 w-16 border' />
        <h2 className="text-black text-3xl font-semibold dark:text-white text-center max-w-3xl">
          {`Hi, ${session ? session.user?.name : "Guest"}`}
        </h2>
        <p className="text-sm text-neutral-500 max-w-lg text-center">
          Translate languages effortlessly with a smart AI-powered language translator.
        </p>
      </div>
      <div className="w-full relative p-2 bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center dark:shadow-none shadow ">
        <Textarea
          ref={textareaRef}
          value={post}
          onChange={(e) => {
            setPost(e.target.value);
            adjustTextareaHeight();
          }}
          placeholder="Type your desired language..."
          className="h-fit text-white w-full bg-transparent focus:outline-none focus:border-none max-h-[300px]"
          rows={1}
        />
        <div className="flex justify-between items-end w-full gap-3 mt-6">
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-3">
              <div>
                <Select onValueChange={(value: string) => {
                  setLanguage(value);
                }}>
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
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <button
              className={`bg-transparent rounded-lg before:bg-opacity-5 hover:bg-white/10 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white p-2 transition-all duration-300 ${!post ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={handleGenerate}
              disabled={!post}
            >
              {isGenerating ? <Spinner size={"small"} /> : <FaArrowTurnUp className="h-4 w-4" />}
            </button>
            <button
              className={`bg-transparent rounded-lg before:bg-opacity-5 hover:bg-white/10 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white p-2 transition-all duration-300 ${!post ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={handleGenerate}
              disabled={!post}
            >
              {isGenerating ? <Spinner size={"small"} /> : <FaMicrophone className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      {result ? (
        <Result />
      ) : (
        <PostGeneratorSteps />
      )}
    </main >
  )
}