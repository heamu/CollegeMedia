function SignInSignUp() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="w-screen h-screen  bg-black text-white flex items-center justify-center">
      <div className="flex w-[80%] h-full flex-col md:flex-row box-border">
        {/* Left Side */}
        <div className="flex-1  flex flex-col justify-center items-start">
          {/* <h1 className="text-5xl font-bold mb-4">College media</h1> */}
          <h1 className=" text-5xl font-bold h-15">College media</h1>
          <div className="text-gray-400 text-1xl leading-relaxed">
            Where College Minds  Meet:
            Ask, Share, and Grow Together.
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>

        {/* Right Side */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center">
          <p className="text-gray-300 mb-6 text-sm uppercase tracking-widest">
            Sign in or Sign up
          </p>
          <button onClick={() => window.location.href = `${baseUrl}/auth/google`} className="flex items-center gap-3 bg-white text-black font-medium px-6 py-3 rounded-full shadow-md hover:shadow-blue-500/40 transition-all duration-200">
            
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignInSignUp;
