import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className='min-h-screen flex flex-col gap-10 items-center justify-center pt-27 mx-auto p-7'>
      <div className="flex items-center flex-col gap-4">
             <p>IT's TIME TO BECOME A</p> 

      <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl'>
        GYM DA<span className='text-blue-400'> SHOKEEN</span>
      </h1>
      </div>
      <p className='font-bold text-sm md:text-base text-center'>
        I hereby acknowledge that I may become <span className='text-blue-400 text-xl font-bold uppercase'>unbelievably enormous</span> and accept all risks of becoming
        the local <span className='text-blue-400 font-bold text-xl uppercase'>PEHLWAN</span>, afflicted with severe body dysmorphia unable to fit in through doors
      </p>
     <Button func={() => 
      window.location.href = '#generate'
     }text={"Accept and Begin"}/>
    </div>
  );
}
