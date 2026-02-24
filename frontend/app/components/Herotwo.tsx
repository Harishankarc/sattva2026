"use client";
import React, { useEffect, useState } from 'react'

type TimeLeft ={
    days:number;
    hours:number;
    minutes:number;
    seconds:number;
}

const TARGET_DATE = new Date("2026-03-07T00:00:00")
const Herotwo = () => {
    const calculateTimeLeft = (): TimeLeft => {
        const now = new Date().getTime();

        const difference = TARGET_DATE.getTime() - now;

        if (difference <=0){
            return { days:0,hours:0,minutes:0,seconds:0};
        }

        return{
            days:Math.floor(difference/(1000*60*60*24)),
            hours:Math.floor((difference/(1000*60*60)) % 24),
            minutes:Math.floor((difference/(1000*60)) % 60),
            seconds:Math.floor((difference/1000) % 60),
        };
    }

    const [timeLeft,setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect( () => {
        const timer = setInterval( () => {
            setTimeLeft(calculateTimeLeft())
        },1000);

        return () => clearInterval(timer);
    },[]);

    const TimeBox = ({ label, value }: { label: string; value: number }) => (
        <div className="text-[10px] " style={{fontFamily:'alfa-slab-one-regular'}}>
          {value}
        </div>
      );


  return (
    <div className='h-screen w-screen bg-black flex items-center justify-center'>
        <div className='overflow-hidden h-[70vh] w-[60vw]'>

        <img src="/E8207658-53E8-4C58-8DEA-8866A0D6AA68.png" className="brightness-45 object- scale-160" />
        </div>
        <div className='timer absolute'>
        <div className="flex gap-1 text-[10px]  " >
        <TimeBox label="" value={timeLeft.days} />:
        <TimeBox label="" value={timeLeft.hours} />:
        <TimeBox label="" value={timeLeft.minutes} />:
        <TimeBox label="" value={timeLeft.seconds} />
      </div>
        </div>
    </div>
  )
}

export default Herotwo