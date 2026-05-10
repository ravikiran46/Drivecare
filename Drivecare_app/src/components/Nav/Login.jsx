import { useState, useEffect } from "react";
import instance from "../api/api_Instance";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../Context/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    // formState: { errors },
  } = useForm();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30); // Countdown for resend OTP
  const [canResendOtp, setCanResendOtp] = useState(false); // Resend OTP control
  const navigate = useNavigate();
  const { login } = useAuth();
  const formData = watch();

  // Timer management
  useEffect(() => {
    if (isOtpSent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setCanResendOtp(true);
    }
  }, [isOtpSent, countdown]);

  const sendOtp = async (data) => {
    try {
      const res = await instance.post("/login", {
        name: data.name,
        email: data.email,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success(`OTP sent to ${data.email}`);
        setIsOtpSent(true);
        setCountdown(30); // Reset countdown
        setCanResendOtp(false); // Disable resend OTP initially
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resendOtp = async () => {
    if (formData.name && formData.email) {
      await sendOtp(formData); // Resend the OTP
      setCountdown(30); // Reset the countdown
      setCanResendOtp(false); // Disable the resend button again
    } else {
      toast.error("Name and email are required to resend OTP.");
    }
  };

  const verifyOtp = async (email) => {
    try {
      const res = await instance.post("/verifyotp", {
        otp: otp,
        email: email,
      });
      if (res.status === 200) {
        toast.success(res.data.msg);
        setTimeout(() => {
          login(res.data.token);
          navigate("/user");
        }, 1000);
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    if (!isOtpSent) {
      sendOtp(data); // Send OTP
    } else {
      verifyOtp(data.email); // Verify OTP
    }
  };

  return (
    <>
      <nav className="border border-gray-200 bg-slate-50 dark:bg-gray-800 dark:border-gray-600">
        <div className="p-6 ml-auto md:ml-8">
          <a href="/" className="">
            <span className="text-2xl font-semibold text-gray-800">
              Drivecare
            </span>
          </a>
        </div>
      </nav>
      <div
        className=" h-[100vh] bg-gradient-to-br from-[#ffffff] 
       to-purple-200 flex justify-center p-10 gap-5 md:gap-20 m-0"
      >
        <div className="relative hidden mt-8 mr-5 text-3xl font-bold opacity-0 text-violet-600 animate-fadeinup md:block">
          <h1 className="text-4xl">Keep Your Ride Running Smoothly!</h1>
          <div className="mt-12 mr-20 text-sm text-neutral-700">
            {/* content1 */}
            <h1 className="w-1/2 p-5 mb-10 bg-white border shadow-lg rounded-xl">
              Book your car or bike service in minutes.
            </h1>
            {/* content2 */}
            <h1 className="w-1/2 p-5 mb-10 bg-white border shadow-lg rounded-xl ml-52">
              Quality repairs and maintenance guaranteed.
            </h1>
            {/* content3 */}
            <h1 className="w-1/2 p-5 mb-10 bg-white border shadow-lg rounded-xl">
              Track your service status anytime, anywhere.
            </h1>
          </div>
        </div>

        <div className="md:mt-24">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="box-border w-full max-w-[400px] p-6 bg-white rounded-xl shadow-md text-center"
          >
            <div className="text-center">
              <h1 className="mb-3 text-2xl font-semibold">Drivecare</h1>
              <span className="text-sm text-slate-600">
                We&apos;ll sign you in or create a new account if you don&apos;t
                have one yet
              </span>
            </div>

            {/* Name Input */}
            <div className="flex flex-col items-center mt-5 mb-4 sm:flex-row">
              <input
                type="text"
                className="flex-grow w-full p-2 bg-gray-100 border border-solid rounded-md sm:w-auto"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col items-center mb-4 sm:flex-row">
              <input
                type="email"
                className="flex-grow w-full p-2 bg-gray-100 border border-solid rounded-md sm:w-auto"
                placeholder="Email/Mobile Number"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            {/* OTP Input */}
            {isOtpSent && (
              <>
                <div className="flex sm:flex-row">
                  <input
                    type="text"
                    className="flex-grow w-full p-2 bg-gray-100 border border-solid rounded-md sm:w-auto"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                </div>

                {/* Countdown Timer */}
                <div className="m-2 text-right">
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={() => resendOtp()}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Resend OTP in {countdown}s
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full p-3 text-base font-medium text-white transition duration-200 rounded cursor-pointer bg-violet-600 hover:bg-violet-500"
              >
                {isOtpSent ? "Verify OTP" : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
