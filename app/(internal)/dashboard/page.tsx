"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Dashboard = () => {

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

  return (
    <div className='flex flex-col min-h-screen items-center justify-center pt-10'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <Image src={"/logo.png"} alt="logo" width={500} height={500} className='rounded-lg h-16 w-16 border' />
        <h2 className='text-black text-3xl font-semibold dark:text-white text-center max-w-2xl'>Hackathon</h2>
        <p className="text-sm text-neutral-500 text-center max-w-xl">
          Random para.
        </p>
      </div>
      <p className="h-[30px] flex items-center justify-center text-neutral-500 text-xs w-full mt-auto">© 2025 test.AI</p>
    </div>
  )
}

export default Dashboard