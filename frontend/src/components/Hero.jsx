const Hero = ({ title, subtitle }) => {
  return (
    <>
      <section className="bg-gray-100 py-20 mb-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl pb-5 mb-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 sm:text-5xl md:text-6xl">
              Become a Working Professional
              {title}
            </h1>
            <p className="my-4 text-xl text-black">
              Find the job that fits your skills and needs
              {subtitle}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
