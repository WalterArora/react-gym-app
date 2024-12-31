import React from 'react';

// SectionWrapper Component
export default function SectionWrapper(props) {
  const { children, header, title,id } = props;

  return (
    <section id={id} className="min-h-screen flex flex-col gap-10">
      {/* Header Section */}
      <div className="bg-slate-950 py-10 flex flex-col gap-2 justify-center items-center text-center p-4">
        <p className="uppercase font-medium text-sm text-slate-400 tracking-widest">
          {header}
        </p>
        <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
          {Array.isArray(title) ? (
            <>
              {title[0]}{' '}
              <span className="uppercase text-blue-400">{title[1]}</span>{' '}
              {title[2]}
            </>
          ) : (
            <>
              {title.split(' ')[0]}{' '}
              <span className="text-blue-400">
                {title.split(' ')[1]}
              </span>{' '}
              {title.split(' ')[2]}
            </>
          )}
        </h2>
      </div>

      {/* Content Section */}
      <div className="max-w-[800px] w-full flex flex-col mx-auto gap-10 p-4">
        {children}
      </div>
    </section>
  );
}
