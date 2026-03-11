export const shimmerAnimation = "skeleton rounded-xl";

export const HomeShimmer = () => (
  <div className="w-full space-y-20 pb-20">
    {/* Hero Area */}
    <div className="h-[70vh] w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-100 skeleton"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
           <div className="h-6 w-32 rounded-full skeleton"></div>
           <div className="h-16 w-3/4 max-w-3xl rounded-2xl skeleton"></div>
           <div className="h-8 w-1/2 max-w-lg rounded-xl skeleton"></div>
           <div className="h-14 w-48 rounded-2xl skeleton mt-8"></div>
        </div>
    </div>
    
    {/* Info Cards */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-80">
        <div className="rounded-[2.5rem] skeleton h-full w-full"></div>
        <div className="rounded-[2.5rem] skeleton h-full w-full"></div>
      </div>
    </div>

    {/* Jobs List */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="h-10 w-64 mx-auto rounded-xl skeleton"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 rounded-[2.5rem] skeleton w-full"></div>
        ))}
      </div>
    </div>
  </div>
);

export const JobsShimmer = () => (
  <section className="bg-slate-50/50 px-4 py-10 min-h-screen w-full pt-28">
    <div className="container-xl lg:container m-auto max-w-6xl">
      <div className="h-10 w-48 mb-10 mx-auto rounded-xl skeleton"></div>
      <div className="flex justify-center mb-12 gap-4">
        <div className="h-14 w-full max-w-xl rounded-2xl skeleton"></div>
        <div className="h-14 w-32 rounded-2xl skeleton"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col h-full shadow-sm">
            <div className="h-7 rounded-lg w-2/3 mb-4 skeleton"></div>
            <div className="h-4 rounded-md w-full mb-3 skeleton"></div>
            <div className="h-4 rounded-md w-4/5 mb-8 skeleton"></div>
            <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-50">
              <div className="h-5 rounded-md w-1/3 skeleton"></div>
              <div className="h-12 rounded-xl w-32 skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const JobDetailsShimmer = () => (
  <section className="bg-slate-50/50 min-h-screen py-10 px-6 w-full pt-28">
    <div className="container m-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-8">
        <main className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 h-64 skeleton"></div>
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 rounded-2xl skeleton w-full"></div>
                ))}
             </div>
             <div className="h-8 rounded-xl w-1/3 mb-6 skeleton"></div>
             <div className="h-32 rounded-2xl skeleton w-full mb-8"></div>
             
             <div className="h-8 rounded-xl w-1/3 mb-6 mt-12 skeleton"></div>
             <div className="h-32 rounded-2xl skeleton w-full mb-8"></div>
          </div>
        </main>
        <aside>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
             <div className="h-16 w-16 rounded-2xl mb-6 mx-auto lg:mx-0 skeleton"></div>
             <div className="h-6 rounded-lg w-1/2 mb-4 mx-auto lg:mx-0 skeleton"></div>
             <div className="h-10 rounded-xl w-3/4 mb-6 mx-auto lg:mx-0 skeleton"></div>
             <div className="h-32 rounded-2xl w-full skeleton"></div>
          </div>
        </aside>
      </div>
    </div>
  </section>
);

export const FormShimmer = () => (
  <section className="bg-slate-50/50 min-h-screen flex items-center justify-center p-4 w-full pt-28">
    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm w-full max-w-md">
      <div className="h-10 rounded-xl w-3/4 mx-auto mb-10 skeleton"></div>
      
      <div className="space-y-6 pt-4">
         <div className="space-y-3">
            <div className="h-4 rounded-md w-1/4 skeleton"></div>
            <div className="h-14 rounded-2xl w-full skeleton"></div>
         </div>
         <div className="space-y-3">
            <div className="h-4 rounded-md w-1/4 skeleton"></div>
            <div className="h-14 rounded-2xl w-full skeleton"></div>
         </div>
         <div className="h-16 rounded-2xl w-full mt-10 skeleton"></div>
         <div className="h-5 rounded-md w-1/2 mx-auto skeleton"></div>
      </div>
    </div>
  </section>
);

export const ProfileShimmer = () => (
  <section className="bg-slate-50/50 min-h-screen py-10 px-4 w-full pt-28">
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white p-10 rounded-[2rem] border border-slate-100">
        <div className="flex justify-between items-center mb-10">
           <div className="h-9 rounded-xl w-1/3 skeleton"></div>
           <div className="h-12 rounded-2xl w-28 skeleton"></div>
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="mb-8">
             <div className="h-4 rounded-md w-24 mb-3 skeleton"></div>
             <div className="h-6 rounded-lg w-2/3 skeleton"></div>
          </div>
        ))}
        <div className="h-32 rounded-3xl mt-10 skeleton"></div>
      </div>
    </div>
  </section>
);

export const DashboardShimmer = () => (
   <section className="bg-slate-50/50 min-h-screen py-10 px-4 w-full pt-28">
     <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
           <div className="space-y-4 w-full md:w-1/2">
              <div className="h-6 w-32 rounded-full skeleton"></div>
              <div className="h-12 w-3/4 rounded-xl skeleton"></div>
              <div className="h-5 w-1/2 rounded-md skeleton"></div>
           </div>
           <div className="h-14 w-48 rounded-2xl skeleton"></div>
        </div>
        
        <div className="flex gap-4 mb-10 overflow-hidden">
           {[1,2,3,4].map(i => (
              <div key={i} className="h-32 min-w-[200px] flex-1 rounded-3xl skeleton"></div>
           ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
           <div className="h-20 bg-slate-50/50 border-b border-slate-50 skeleton"></div>
           <div className="p-8 space-y-4">
              {[1,2,3].map(i => (
                 <div key={i} className="h-24 rounded-3xl border border-slate-50 skeleton"></div>
              ))}
           </div>
        </div>
     </div>
   </section>
);
