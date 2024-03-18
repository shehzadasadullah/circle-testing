import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, appleProvider } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";
import { db } from "@/firebase";
import {
  setDoc,
  doc,
  getDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
import { MuiTelInput } from "mui-tel-input";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import toast from "react-simple-toasts";
import { ThreeDots } from "react-loader-spinner";

//modal for login/restring user to firebase
const Register = ({ showModal, setShowModal }) => {
  const [activeTab, setActiveTab] = useState("signin");
  //forgot password
  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [reseterror, setResetError] = useState(null);
  //phone number state
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signInError, setSignInError] = useState(null);
  //password toggle  button
  const [passwordShown, setPasswordShown] = useState(false);
  //register functionality
  const [registerError, setRegisterError] = useState(null);
  //sign in functionality
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginWithNumber, setLoginWithNumber] = useState(false);
  const [registerWithNumber, setRegisterWithNumber] = useState(false);

  //router
  const router = useRouter();

  //linkedin login functionality//redirecting to linkedin then getting auth code to redirected url
  const LinkedinLogin = () => {
    let authorizationEndpoint =
      "https://www.linkedin.com/oauth/v2/authorization";
    let clientId = "86imx6ec1qvuky";
    let redirectUrl = "https://circle.ooo/linkedinauth/";
    let responseType = "code";
    let scope = "r_liteprofile%20r_emailaddress%20r_basicprofile";
    let state = "linkedinlogin";

    let url = `${authorizationEndpoint}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}`;
    let path = router.asPath.split(/[?#]/)[0] || "";
    let objectToPush = {
      returnPath: path,
    };
    //storing return path in local storage
    localStorage.setItem("returnPath", JSON.stringify(objectToPush));
    router.push(url);
  };

  //firebase auth
  const [user, loading, error] = useAuthState(auth);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  //google sign in function
  const GoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          company_name: "",
          companyaddress: "",
          uid: user.uid,
          display_name: user.displayName,
          email: user.email,
          full_name: user.displayName,
          full_name_insensitive: user.displayName.toUpperCase(),
          job_title: "",
          phone_number: "",
          created_time: new Date(),
          who_i_met: {},

          // add additional user data here
        });
      }
      toast("Logged In Successfully!");
      handleCloseModal();
    } catch (error) {
      toast("Error!");
      console.error(error);
      // Add any additional error handling or logging here
    }
  };

  //reset Password Functionality
  const [resetPasswordLoader, setResetPasswordLoader] = useState(false);
  const handleResetPassword = async (e) => {
    setResetPasswordLoader(true);
    e.preventDefault();
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(resetEmail)) {
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        setResetPasswordSent(true);
        toast("Reset Password Email Sent!");
        setResetPasswordLoader(false);
      } catch (error) {
        setResetError(error.message);
        toast(error.message);
        setResetPasswordLoader(false);
      }
    } else {
      toast("Invalid Email!");
    }
  };

  //apple login fuction
  const AppleSignIn = async () => {
    try {
      const result = await signInWithRedirect(auth, appleProvider);
      const { user } = result;

      // Save user data to Firestore
      const userRef = collection(db, "Users").doc(user.uid);
      await setDoc(
        userRef,
        {
          company_name: "",
          companyaddress: "",
          uid: user.uid,
          display_name: user.displayName,
          email: user.email,
          full_name: user.displayName,
          full_name_insensitive: user.displayName.toUpperCase(),
          job_title: "",
          phone_number: "",
          created_time: new Date(),
          provider: "apple",
          who_i_met: {},
        },
        { merge: true }
      );
      toast("Logged In Successfully!");
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast("Error!");
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  //emai password Sigin in function
  const [registerLoader, setRegisterLoader] = useState(false);
  const register = async (e) => {
    setRegisterLoader(true);
    e.preventDefault();
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharacterRegex.test(name)) {
      toast("Please Enter a Valid Full Name!");
      setRegisterLoader(false);
    } else if (phone === "") {
      toast("Please enter phone number!");
      setRegisterLoader(false);
    } else if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      toast("Passwords do not match!");
      setRegisterLoader(false);
    } else {
      try {
        // create user account
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // store user data in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          company_name: "",
          companyaddress: "",
          uid: user.uid,
          display_name: name,
          email: user.email,
          full_name: name,
          full_name_insensitive: name.toUpperCase(),
          job_title: "",
          phone_number: phone,
          created_time: new Date(),
          who_i_met: {},
          // add additional user data here
        });
        toast("Registration Successful!");
        handleCloseModal();
        setActiveTab("signin");
        setRegisterLoader(false);
      } catch (error) {
        console.log(error.message);
        if (
          error.message ===
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          toast("Password should be at least 6 characters!");
        } else if (
          error.message === "Firebase: Error (auth/email-already-in-use)."
        ) {
          toast("Email already in use!");
        }
        setRegisterError(error.message);
        setRegisterLoader(false);
      }
    }
  };

  //email password login method
  const [signInLoader, setSignInLoader] = useState(false);
  const handleSubmit = async (e) => {
    setSignInLoader(true);
    e.preventDefault();
    if (email === "") {
      toast("Please Enter Email!");
      setSignInLoader(false);
    } else if (password === "") {
      toast("Please Enter Password!");
      setSignInLoader(false);
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast("Logged In Successfully!");
        handleCloseModal();
        setSignInLoader(false);
      } catch (error) {
        console.log(error.message);
        if (
          error.message === "Firebase: Error (auth/invalid-login-credentials)."
        ) {
          toast("Invalid Login Credentials!");
        } else {
          toast(error.message);
        }
        setSignInError(error.message);
        setSignInLoader(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          style={{
            background: "linear-gradient(180deg, #0E0824 0%, #1C0632 100%)",
          }}
          className="inline-block w-full lg:w-[40%] align-middle rounded-lg shadow-xl transform transition-all"
        >
          <div className="w-full flex justify-center border-b-2 items-center px-6 py-3">
            <p className="font-semibold w-full text-xl text-[#fff]">
              Get Started
            </p>
            <button
              type="button"
              className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6 text-[#fff]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="w-full h-auto flex justify-center items-center flex-col p-2 lg:p-6">
            <div
              className="flex w-full"
              style={{
                borderRadius: 6,
                background:
                  "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                backdropFilter: "blur(40px)",
              }}
            >
              <button
                style={{
                  background:
                    activeTab === "signin" ||
                    ("forgot" && activeTab != "register")
                      ? "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)"
                      : "",
                  color:
                    activeTab === "signin" ||
                    ("forgot" && activeTab != "register")
                      ? "#fff"
                      : "#fff",
                }}
                className={`w-full rounded-[6px] py-2 ml-1 mr-1 mt-1 mb-1 font-Inter font-semibold text-[14px]`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange("signin");
                }}
              >
                Sign in
              </button>
              <button
                style={{
                  background:
                    activeTab === "register"
                      ? "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)"
                      : "",
                  color: activeTab === "register" ? "#fff" : "#fff",
                }}
                className={`w-full  rounded-[6px] py-2 ml-1 mr-1 mt-1 mb-1 font-Inter font-semibold text-[14px]`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange("register");
                }}
              >
                Register
              </button>
            </div>

            {activeTab === "signin" ? ( // signin
              loginWithNumber ? ( // login with number
                <>
                  <form className="w-full p-8" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-[#000000] text-left text-[14px] font-normal font-Inter mb-2"
                        htmlFor="email"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
                        placeholder="Your number"
                        style={{
                          color: email ? "black" : "rgba(0, 0, 0, 0.5)",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordShown ? "text" : "password"}
                          style={{
                            color: password ? "black" : "rgba(0, 0, 0, 0.5)",
                          }}
                          className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePasswordVisiblity();
                          }}
                        >
                          {passwordShown ? (
                            <EyeIcon className="h-5 w-5 text-[#000000]" />
                          ) : (
                            <EyeOffIcon className="h-5 w-5 text-[#000000]" />
                          )}
                        </button>
                      </div>
                    </div>
                    {email != "" && signInError && (
                      <div className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
                        {signInError}
                      </div>
                    )}

                    <div className="relative mt-12 w-full flex items-end justify-end">
                      <span
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();

                          setActiveTab("forgot");
                        }}
                      >
                        Forgot password?
                      </span>
                    </div>

                    <div className="mt-6 mb-4">
                      <button
                        type="submit"
                        className="bg-[#007BAB] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
                      >
                        Sign in
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center mb-6 mt-8">
                      <p
                        className="font-Inter text-[14px] font-normal"
                        style={{ color: "rgba(0, 0, 0, 0.7)" }}
                      >
                        Other sign in options
                      </p>
                      <p
                        onClick={() => {
                          setLoginWithNumber(false);
                        }}
                        className="font-Inter text-[#123B79] text-[16px] mt-4 cursor-pointer hover:underline font-semibold"
                      >
                        Sign in using Email
                      </p>
                    </div>
                    <div className="w-full flex items-center justify-center flex-col gap-4 mt-8">
                      <div className="flex flex-row justify-center items-center gap-4">
                        <div className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full">
                          <button
                            className="w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center"
                            onClick={(e) => {
                              e.preventDefault();
                              LinkedinLogin();
                            }}
                          >
                            <img
                              src="/linkedin.svg"
                              alt="Social Media Icon"
                              className="w-full h-auto"
                            />
                          </button>
                        </div>
                        <div
                          className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            GoogleSignIn();
                          }}
                        >
                          <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                            <img
                              src="/GoogleIcon.svg"
                              alt="Social Media Icon"
                              className="w-full h-auto"
                            />
                          </a>
                        </div>
                        <div
                          className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            AppleSignIn();
                          }}
                        >
                          <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                            <img
                              src="/Apple.svg"
                              alt="Social Media Icon"
                              className="w-full h-auto"
                            />
                          </a>
                        </div>
                      </div>

                      <p
                        style={{
                          fontFamily: "Montserrat",
                          fontStyle: "normal",
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#999999",
                        }}
                      >
                        Agree to the{" "}
                        <u>
                          <Link href="/terms" className="underline">
                            Terms &amp; Conditions
                          </Link>
                        </u>{" "}
                        &amp;{" "}
                        <u>
                          <Link href="/privacy-policy" className="underline">
                            Privacy Policy
                          </Link>
                        </u>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                // login with email address
                <>
                  <form className="w-full p-8" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-[#fff] text-left mb-2"
                        htmlFor="email"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        placeholder="Your email"
                        // style={{
                        //   color: email ? "black" : "rgba(0, 0, 0, 0.5)",
                        // }}
                        className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                        style={{
                          background:
                            "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-left text-[#fff] mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordShown ? "text" : "password"}
                          className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                          style={{
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          }}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePasswordVisiblity();
                          }}
                        >
                          {passwordShown ? (
                            <EyeOffIcon className="h-5 w-5 text-[#fff]" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-[#fff]" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* {email != "" && signInError && (
                      <div className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
                        {signInError}
                      </div>
                    )} */}

                    <div className="relative text-[#fff] mt-12 w-full flex items-end justify-end">
                      <span
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab("forgot");
                        }}
                      >
                        Forgot password?
                      </span>
                    </div>

                    <div className="mt-6 mb-4">
                      <button
                        type="submit"
                        disabled={signInLoader}
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.20)",
                          boxShadow: "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                          background:
                            "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                        }}
                        className="text-white w-full py-4 rounded-lg focus:outline-none"
                      >
                        {signInLoader ? (
                          <>
                            <div className="flex justify-center items-center w-full">
                              <ThreeDots
                                height="25"
                                color="#fff"
                                width="50"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                visible={true}
                              />
                            </div>
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center mb-6 mt-8">
                      <p className="text-[#fff]">Other sign in options</p>
                      {/* <p
                        onClick={() => {
                          setLoginWithNumber(true);
                        }}
                        className="font-Inter text-[#123B79] text-[16px] mt-4 cursor-pointer hover:underline font-semibold"
                      >
                        Sign in using Phone Number
                      </p> */}
                    </div>
                    <div className="w-full flex items-center justify-center flex-col gap-4 mt-8">
                      <div className="flex flex-row justify-center items-center gap-4">
                        <div
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.16)",
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                            backdropFilter: "blur(40px)",
                          }}
                          className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full"
                        >
                          <button
                            className="w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center"
                            onClick={(e) => {
                              e.preventDefault();
                              LinkedinLogin();
                            }}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_2340_20924)">
                                <path
                                  d="M20.7273 0H3.27273C1.46525 0 0 1.46525 0 3.27273V20.7273C0 22.5347 1.46525 24 3.27273 24H20.7273C22.5347 24 24 22.5347 24 20.7273V3.27273C24 1.46525 22.5347 0 20.7273 0Z"
                                  fill="#0077B5"
                                />
                                <path
                                  d="M8.6456 6.54545C8.6456 6.95001 8.52563 7.34547 8.30088 7.68185C8.07612 8.01822 7.75666 8.28039 7.3829 8.43521C7.00915 8.59002 6.59787 8.63053 6.20109 8.55161C5.80432 8.47268 5.43985 8.27787 5.15379 7.99181C4.86773 7.70575 4.67292 7.34128 4.59399 6.9445C4.51507 6.54772 4.55557 6.13645 4.71039 5.76269C4.8652 5.38894 5.12738 5.06948 5.46375 4.84472C5.80012 4.61996 6.19559 4.5 6.60014 4.5C7.14263 4.5 7.6629 4.7155 8.0465 5.0991C8.4301 5.4827 8.6456 6.00297 8.6456 6.54545ZM8.18196 9.95455V18.9914C8.18232 19.058 8.1695 19.1241 8.14424 19.1858C8.11897 19.2475 8.08177 19.3036 8.03475 19.3509C7.98774 19.3981 7.93185 19.4356 7.87029 19.4612C7.80873 19.4868 7.74272 19.5 7.67605 19.5H5.52014C5.45348 19.5002 5.38743 19.4872 5.32581 19.4618C5.26418 19.4363 5.20819 19.399 5.16105 19.3518C5.11391 19.3047 5.07655 19.2487 5.05112 19.1871C5.02569 19.1254 5.01269 19.0594 5.01287 18.9927V9.95455C5.01287 9.82001 5.06632 9.69098 5.16145 9.59585C5.25658 9.50072 5.38561 9.44727 5.52014 9.44727H7.67605C7.81035 9.44763 7.93903 9.50124 8.03387 9.59633C8.1287 9.69142 8.18196 9.82024 8.18196 9.95455ZM19.4511 14.6591V19.0336C19.4512 19.0949 19.4393 19.1557 19.4159 19.2123C19.3925 19.269 19.3582 19.3205 19.3149 19.3638C19.2715 19.4071 19.22 19.4415 19.1634 19.4649C19.1067 19.4882 19.046 19.5002 18.9847 19.5H16.6665C16.6052 19.5002 16.5445 19.4882 16.4878 19.4649C16.4312 19.4415 16.3797 19.4071 16.3363 19.3638C16.293 19.3205 16.2586 19.269 16.2353 19.2123C16.2119 19.1557 16.2 19.0949 16.2001 19.0336V14.7941C16.2001 14.1614 16.3856 12.0232 14.5461 12.0232C13.1211 12.0232 12.8306 13.4864 12.7733 14.1436V19.0336C12.7733 19.1562 12.7251 19.2738 12.6391 19.361C12.5532 19.4483 12.4363 19.4982 12.3138 19.5H10.0747C10.0135 19.5 9.95293 19.4879 9.89643 19.4645C9.83992 19.441 9.7886 19.4066 9.7454 19.3633C9.7022 19.32 9.66798 19.2686 9.64469 19.212C9.6214 19.1554 9.60951 19.0948 9.60969 19.0336V9.915C9.60951 9.85382 9.6214 9.79321 9.64469 9.73663C9.66798 9.68006 9.7022 9.62864 9.7454 9.58531C9.7886 9.54199 9.83992 9.50762 9.89643 9.48416C9.95293 9.46071 10.0135 9.44864 10.0747 9.44864H12.3138C12.4375 9.44864 12.5561 9.49777 12.6435 9.58523C12.731 9.67269 12.7801 9.79131 12.7801 9.915V10.7032C13.3092 9.90955 14.0933 9.29727 15.7665 9.29727C19.4729 9.29727 19.4511 12.7582 19.4511 14.6591Z"
                                  fill="white"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2340_20924">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        </div>
                        <div
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.16)",
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                            backdropFilter: "blur(40px)",
                          }}
                          className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            GoogleSignIn();
                          }}
                        >
                          <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_2340_20911)">
                                <path
                                  d="M23.094 9.91355L13.3046 9.91309C12.8724 9.91309 12.522 10.2634 12.522 10.6957V13.823C12.522 14.2552 12.8724 14.6056 13.3046 14.6056H18.8174C18.2137 16.1722 17.087 17.4842 15.6496 18.3178L18.0002 22.387C21.7709 20.2062 24.0002 16.3799 24.0002 12.0965C24.0002 11.4866 23.9553 11.0506 23.8653 10.5597C23.797 10.1867 23.4732 9.91355 23.094 9.91355Z"
                                  fill="#167EE6"
                                />
                                <path
                                  d="M11.9998 19.3044C9.30193 19.3044 6.94675 17.8304 5.68182 15.6492L1.61279 17.9945C3.6835 21.5834 7.56259 24.0001 11.9998 24.0001C14.1765 24.0001 16.2304 23.414 17.9998 22.3927V22.3871L15.6491 18.3179C14.5739 18.9415 13.3297 19.3044 11.9998 19.3044Z"
                                  fill="#12B347"
                                />
                                <path
                                  d="M18 22.3927V22.3871L15.6494 18.3179C14.5741 18.9414 13.33 19.3044 12 19.3044V24.0001C14.1767 24.0001 16.2308 23.414 18 22.3927Z"
                                  fill="#0F993E"
                                />
                                <path
                                  d="M4.69566 12C4.69566 10.6702 5.05856 9.42613 5.68205 8.35096L1.61302 6.00562C0.586031 7.76938 0 9.81773 0 12C0 14.1824 0.586031 16.2307 1.61302 17.9945L5.68205 15.6491C5.05856 14.5739 4.69566 13.3298 4.69566 12Z"
                                  fill="#FFD500"
                                />
                                <path
                                  d="M11.9998 4.69566C13.759 4.69566 15.375 5.32078 16.6372 6.36061C16.9486 6.61711 17.4012 6.59859 17.6864 6.31336L19.9022 4.09758C20.2258 3.77395 20.2028 3.24422 19.8571 2.94431C17.7423 1.10967 14.9907 0 11.9998 0C7.56259 0 3.6835 2.41673 1.61279 6.00558L5.68182 8.35092C6.94675 6.16969 9.30193 4.69566 11.9998 4.69566Z"
                                  fill="#FF4B26"
                                />
                                <path
                                  d="M16.6374 6.36061C16.9488 6.61711 17.4015 6.59859 17.6866 6.31336L19.9024 4.09758C20.226 3.77395 20.2029 3.24422 19.8573 2.94431C17.7425 1.10963 14.991 0 12 0V4.69566C13.7592 4.69566 15.3752 5.32078 16.6374 6.36061Z"
                                  fill="#D93F21"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2340_20911">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                        </div>
                        <div
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.16)",
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                            backdropFilter: "blur(40px)",
                          }}
                          className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            AppleSignIn();
                          }}
                        >
                          <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_2340_20920)">
                                <path
                                  d="M16.6186 0H16.7893C16.9263 1.69253 16.2803 2.95719 15.4951 3.87301C14.7247 4.78251 13.6698 5.6646 11.9636 5.53076C11.8497 3.86247 12.4968 2.69161 13.2809 1.77789C14.0081 0.92636 15.3412 0.168621 16.6186 0ZM21.7836 17.6167V17.6641C21.3041 19.1163 20.6201 20.361 19.7855 21.516C19.0235 22.5646 18.0898 23.9758 16.4225 23.9758C14.9819 23.9758 14.025 23.0494 12.5485 23.0241C10.9866 22.9988 10.1277 23.7987 8.6997 24H8.21281C7.1642 23.8482 6.31793 23.0178 5.70141 22.2695C3.88347 20.0585 2.47865 17.2025 2.21729 13.5476V12.4737C2.32794 9.85799 3.59892 7.73126 5.28829 6.70057C6.17987 6.15255 7.40553 5.68568 8.77031 5.89435C9.35521 5.98498 9.95276 6.18522 10.4765 6.38335C10.9729 6.5741 11.5937 6.9124 12.1817 6.89448C12.5801 6.88289 12.9763 6.67527 13.3779 6.52878C14.554 6.10407 15.7069 5.61718 17.2266 5.84587C19.053 6.12199 20.3493 6.93347 21.1502 8.18548C19.6052 9.16875 18.3838 10.6505 18.5925 13.1809C18.778 15.4794 20.1143 16.8241 21.7836 17.6167Z"
                                  fill="white"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2340_20920">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </a>
                        </div>
                      </div>

                      {/* <p
                        style={{
                          fontFamily: "Montserrat",
                          fontStyle: "normal",
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#999999",
                        }}
                      >
                        Agree to the{" "}
                        <u>
                          <Link href="/terms" className="underline">
                            Terms &amp; Conditions
                          </Link>
                        </u>{" "}
                        &amp;{" "}
                        <u>
                          <Link href="/privacy-policy" className="underline">
                            Privacy Policy
                          </Link>
                        </u>
                      </p> */}
                    </div>
                  </form>
                </>
              )
            ) : (
              // forgot tab
              <div className="w-full">
                {activeTab == "forgot" ? (
                  <div>
                    {!resetPasswordSent ? (
                      // reset password form
                      <form
                        className="w-full p-5"
                        onSubmit={handleResetPassword}
                      >
                        <div className="w-full">
                          <div>
                            <label
                              className="block text-left text-[#fff] mb-2"
                              htmlFor="email"
                            >
                              Email address
                            </label>
                            <input
                              type="email"
                              className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                              style={{
                                background:
                                  "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                              }}
                              placeholder="Your email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <button
                          disabled={resetPasswordLoader}
                          type="submit"
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.20)",
                            boxShadow:
                              "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                            background:
                              "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                          }}
                          className="text-white mt-5 w-full py-4 rounded-lg focus:outline-none"
                        >
                          {resetPasswordLoader ? (
                            <>
                              {" "}
                              <div className="flex justify-center items-center w-full">
                                <ThreeDots
                                  height="25"
                                  color="#fff"
                                  width="50"
                                  radius="9"
                                  ariaLabel="three-dots-loading"
                                  visible={true}
                                />
                              </div>
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                        {/* {reseterror && (
                          <p className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
                            {reseterror}
                          </p>
                        )} */}
                      </form>
                    ) : (
                      // reset password success message
                      <div className="p-8 flex items-center justify-center flex-col">
                        <div className="w-full text-lg text-[#fff]">
                          A mail regarding your request to reset your password
                          has been sent to{" "}
                          <span className="font-semibold">{resetEmail}</span>
                        </div>
                        <button
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.20)",
                            boxShadow:
                              "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                            background:
                              "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                          }}
                          className="text-white mt-5 w-full py-4 rounded-lg focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab("signin");
                          }}
                        >
                          Understood
                        </button>
                        {/* <p className="w-full font-semibold flex items-end justify-center">
                            {" "}
                            A mail regarding your request to reset your password
                            has been sent to your email address.
                          </p> */}
                      </div>
                    )}
                  </div>
                ) : registerWithNumber ? ( // register with number
                  <>
                    <form className="p-8 w-full" onSubmit={register}>
                      <div className="mb-4">
                        <label
                          className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                          htmlFor="full name"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
                          placeholder="Your Name"
                          style={{
                            color: name ? "black" : "rgba(0, 0, 0, 0.5)",
                          }}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <label
                        className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                        htmlFor="email"
                      >
                        Phone Number
                      </label>
                      <div>
                        <PhoneInput
                          country={"us"}
                          value={phone}
                          onChange={(value) => setPhone(value)}
                          disableDropdown={false}
                          masks={{ US: "+1 (...) ..-...." }}
                          inputStyle={{
                            width: "100%",
                            height: "50px",
                            fontSize: "16px",
                            paddingLeft: "40px",
                          }}
                          containerStyle={{ position: "relative" }}
                        />

                        {/* <svg
                          className="w-5 h-5 absolute top-1/2 -mt-2 left-3 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.986 7.655A8.894 8.894 0 0013 6c-.993 0-1.95.162-2.838.484a1 1 0 10.766 1.896A6.91 6.91 0 0112 8a6.91 6.91 0 01-1.928-.28A1 1 0 009.41 9.1 8.891 8.891 0 007 13c0 .663.072 1.311.212 1.936a1 1 0 001.96-.41c-.111-.461-.17-.939-.17-1.526a7.91 7.91 0 012.188-5.295A7.91 7.91 0 0117 10c0 .588-.058 1.155-.17 1.702a1 1 0 101.96.412zM10 14a4 4 0 100-8 4 4 0 000 8z"
                            clipRule="evenodd"
                          />
                        </svg> */}
                      </div>

                      <div className="mb-4 mt-4">
                        <label
                          className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
                            placeholder="Password"
                            value={password}
                            style={{
                              color: password ? "black" : "rgba(0, 0, 0, 0.5)",
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasswordVisiblity();
                            }}
                          >
                            {passwordShown ? (
                              <EyeIcon className="h-5 w-5 text-[#000000]" />
                            ) : (
                              <EyeOffIcon className="h-5 w-5 text-[#000000]" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                          htmlFor="password"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            style={{
                              color: confirmPassword
                                ? "black"
                                : "rgba(0, 0, 0, 0.5)",
                            }}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>

                        {password !== confirmPassword && (
                          <div className="text-red-500 text-[14px] mb-2">
                            Passwords do not match
                          </div>
                        )}
                      </div>

                      <div className="mt-6 mb-2">
                        <button
                          type="submit"
                          className="bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
                        >
                          Register
                        </button>
                        {registerError && (
                          <div className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
                            {registerError}
                          </div>
                        )}
                      </div>
                      <div className="w-full flex flex-col items-center justify-center mb-4 mt-4">
                        <p
                          className="font-Inter text-[14px] font-normal"
                          style={{ color: "rgba(0, 0, 0, 0.7)" }}
                        >
                          Other sign in options
                        </p>
                        <p
                          onClick={() => {
                            setRegisterWithNumber(false);
                          }}
                          className="font-Inter text-[#123B79] text-[16px] mt-4 cursor-pointer hover:underline font-semibold"
                        >
                          Sign Up using Email
                        </p>
                      </div>
                      <div className="w-full flex items-center justify-center flex-col gap-4 mt-8">
                        <div className="flex flex-row justify-center items-center gap-4">
                          <div className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full">
                            <button
                              className="w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault();
                                LinkedinLogin();
                              }}
                            >
                              <img
                                src="/linkedin.svg"
                                alt="Social Media Icon"
                                className="w-full h-auto"
                              />
                            </button>
                          </div>
                          <div
                            className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              GoogleSignIn();
                            }}
                          >
                            <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                              <img
                                src="/GoogleIcon.svg"
                                alt="Social Media Icon"
                                className="w-full h-auto"
                              />
                            </a>
                          </div>
                          <div
                            className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              AppleSignIn();
                            }}
                          >
                            <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                              <img
                                src="/Apple.svg"
                                alt="Social Media Icon"
                                className="w-full h-auto"
                              />
                            </a>
                          </div>
                        </div>

                        <p
                          style={{
                            fontFamily: "Montserrat",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "12px",
                            color: "#999999",
                          }}
                        >
                          Agree to the{" "}
                          <u>
                            <Link href="/terms" className="underline">
                              Terms &amp; Conditions
                            </Link>
                          </u>{" "}
                          &amp;{" "}
                          <u>
                            <Link href="/privacy-policy" className="underline">
                              Privacy Policy
                            </Link>
                          </u>
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  // register with email address
                  <>
                    <form className="p-8 w-full" onSubmit={register}>
                      <div className="mb-4">
                        <label
                          className="block text-left text-[#fff] mb-2"
                          htmlFor="full name"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                          style={{
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          }}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-left text-[#fff] mb-2"
                          htmlFor="email"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                          style={{
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          }}
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <label
                        className="block text-left text-[#fff] mb-2"
                        htmlFor="email"
                      >
                        Phone Number
                      </label>
                      <div>
                        <MuiTelInput
                          value={phone}
                          defaultCountry="US"
                          // onChange={(value) => }
                          onChange={(value) => {
                            setPhone(value);
                            console.log(value);
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              color: "white",
                              border: "none",
                            },
                            "& .MuiIconButton-label": { color: "white" },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none !important",
                            },
                            "& .MuiButtonBase-root": {
                              color: "white",
                              border: "none",
                            },
                            marginTop: 1,
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.10)",
                            border: "2px solid rgba(61, 255, 208, 0.20)",
                            borderRadius: "0.5rem",
                          }}
                        />
                        {/* <PhoneInput
                          country={"us"}
                          value={phone}
                          onChange={(value) => setPhone(value)}
                          disableDropdown={false}
                          masks={{ US: "+1 (...) ..-...." }} //
                          inputStyle={{
                            width: "100%",
                            color: "#fff",
                            height: "50px",
                            paddingLeft: "50px",
                            borderRadius: "0.375rem",
                            border: "0.5px solid #3DFFD0",
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          }}
                          containerStyle={{
                            position: "relative",
                          }}
                          buttonStyle={{
                            color: "#fff",
                            background:
                              "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          }}
                          // dropdownStyle={{
                          //   background:
                          //     "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          // }}
                          // searchStyle={{
                          //   background:
                          //     "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                          // }}
                          required
                        /> */}

                        {/* <svg
                          className="w-5 h-5 absolute top-1/2 -mt-2 left-3 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.986 7.655A8.894 8.894 0 0013 6c-.993 0-1.95.162-2.838.484a1 1 0 10.766 1.896A6.91 6.91 0 0112 8a6.91 6.91 0 01-1.928-.28A1 1 0 009.41 9.1 8.891 8.891 0 007 13c0 .663.072 1.311.212 1.936a1 1 0 001.96-.41c-.111-.461-.17-.939-.17-1.526a7.91 7.91 0 012.188-5.295A7.91 7.91 0 0117 10c0 .588-.058 1.155-.17 1.702a1 1 0 101.96.412zM10 14a4 4 0 100-8 4 4 0 000 8z"
                            clipRule="evenodd"
                          />
                        </svg> */}
                      </div>

                      <div className="mb-4 mt-4">
                        <label
                          className="block text-left text-[#fff] mb-2"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                            style={{
                              background:
                                "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasswordVisiblity();
                            }}
                          >
                            {passwordShown ? (
                              <EyeOffIcon className="h-5 w-5 text-[#fff]" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-[#fff]" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-left text-[#fff] mb-2"
                          htmlFor="password"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            className="text-[#fff] border border-opacity-20 focus:border-opacity-60 border-[#3DFFD0] border-2 focus:border-2 outline-none w-full py-4 rounded-md px-4"
                            style={{
                              background:
                                "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                            }}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>

                        {/* {password !== confirmPassword && (
                          <div className="text-red-500 text-[14px] mb-2">
                            Passwords do not match
                          </div>
                        )} */}
                      </div>

                      <div className="mt-6 mb-2">
                        <button
                          disabled={registerLoader}
                          type="submit"
                          style={{
                            border: "1px solid rgba(255, 255, 255, 0.20)",
                            boxShadow:
                              "0px 4px 50px 0px rgba(69, 50, 191, 0.50)",
                            background:
                              "linear-gradient(90deg, #4532BF 5.81%, #9429FF 100%)",
                          }}
                          className="text-white w-full py-4 rounded-lg focus:outline-none"
                        >
                          {registerLoader ? (
                            <>
                              <div className="flex justify-center items-center w-full">
                                <ThreeDots
                                  height="25"
                                  color="#fff"
                                  width="50"
                                  radius="9"
                                  ariaLabel="three-dots-loading"
                                  visible={true}
                                />
                              </div>
                            </>
                          ) : (
                            "Sign Up"
                          )}
                        </button>
                        {/* {registerError && (
                          <div className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
                            {registerError}
                          </div>
                        )} */}
                      </div>
                      <div className="w-full flex flex-col items-center justify-center mb-4 mt-4">
                        <p className="text-[#fff]">Other sign in options</p>
                        {/* <p
                          onClick={() => {
                            setRegisterWithNumber(true);
                          }}
                          className="font-Inter text-[#123B79] text-[16px] mt-4 cursor-pointer hover:underline font-semibold"
                        >
                          Sign Up using Phone Number
                        </p> */}
                      </div>
                      <div className="w-full flex items-center justify-center flex-col gap-4 mt-8">
                        <div className="flex flex-row justify-center items-center gap-4">
                          <div
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.16)",
                              background:
                                "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                              backdropFilter: "blur(40px)",
                            }}
                            className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full"
                          >
                            <button
                              className="w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center"
                              onClick={(e) => {
                                e.preventDefault();
                                LinkedinLogin();
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_2340_20924)">
                                  <path
                                    d="M20.7273 0H3.27273C1.46525 0 0 1.46525 0 3.27273V20.7273C0 22.5347 1.46525 24 3.27273 24H20.7273C22.5347 24 24 22.5347 24 20.7273V3.27273C24 1.46525 22.5347 0 20.7273 0Z"
                                    fill="#0077B5"
                                  />
                                  <path
                                    d="M8.6456 6.54545C8.6456 6.95001 8.52563 7.34547 8.30088 7.68185C8.07612 8.01822 7.75666 8.28039 7.3829 8.43521C7.00915 8.59002 6.59787 8.63053 6.20109 8.55161C5.80432 8.47268 5.43985 8.27787 5.15379 7.99181C4.86773 7.70575 4.67292 7.34128 4.59399 6.9445C4.51507 6.54772 4.55557 6.13645 4.71039 5.76269C4.8652 5.38894 5.12738 5.06948 5.46375 4.84472C5.80012 4.61996 6.19559 4.5 6.60014 4.5C7.14263 4.5 7.6629 4.7155 8.0465 5.0991C8.4301 5.4827 8.6456 6.00297 8.6456 6.54545ZM8.18196 9.95455V18.9914C8.18232 19.058 8.1695 19.1241 8.14424 19.1858C8.11897 19.2475 8.08177 19.3036 8.03475 19.3509C7.98774 19.3981 7.93185 19.4356 7.87029 19.4612C7.80873 19.4868 7.74272 19.5 7.67605 19.5H5.52014C5.45348 19.5002 5.38743 19.4872 5.32581 19.4618C5.26418 19.4363 5.20819 19.399 5.16105 19.3518C5.11391 19.3047 5.07655 19.2487 5.05112 19.1871C5.02569 19.1254 5.01269 19.0594 5.01287 18.9927V9.95455C5.01287 9.82001 5.06632 9.69098 5.16145 9.59585C5.25658 9.50072 5.38561 9.44727 5.52014 9.44727H7.67605C7.81035 9.44763 7.93903 9.50124 8.03387 9.59633C8.1287 9.69142 8.18196 9.82024 8.18196 9.95455ZM19.4511 14.6591V19.0336C19.4512 19.0949 19.4393 19.1557 19.4159 19.2123C19.3925 19.269 19.3582 19.3205 19.3149 19.3638C19.2715 19.4071 19.22 19.4415 19.1634 19.4649C19.1067 19.4882 19.046 19.5002 18.9847 19.5H16.6665C16.6052 19.5002 16.5445 19.4882 16.4878 19.4649C16.4312 19.4415 16.3797 19.4071 16.3363 19.3638C16.293 19.3205 16.2586 19.269 16.2353 19.2123C16.2119 19.1557 16.2 19.0949 16.2001 19.0336V14.7941C16.2001 14.1614 16.3856 12.0232 14.5461 12.0232C13.1211 12.0232 12.8306 13.4864 12.7733 14.1436V19.0336C12.7733 19.1562 12.7251 19.2738 12.6391 19.361C12.5532 19.4483 12.4363 19.4982 12.3138 19.5H10.0747C10.0135 19.5 9.95293 19.4879 9.89643 19.4645C9.83992 19.441 9.7886 19.4066 9.7454 19.3633C9.7022 19.32 9.66798 19.2686 9.64469 19.212C9.6214 19.1554 9.60951 19.0948 9.60969 19.0336V9.915C9.60951 9.85382 9.6214 9.79321 9.64469 9.73663C9.66798 9.68006 9.7022 9.62864 9.7454 9.58531C9.7886 9.54199 9.83992 9.50762 9.89643 9.48416C9.95293 9.46071 10.0135 9.44864 10.0747 9.44864H12.3138C12.4375 9.44864 12.5561 9.49777 12.6435 9.58523C12.731 9.67269 12.7801 9.79131 12.7801 9.915V10.7032C13.3092 9.90955 14.0933 9.29727 15.7665 9.29727C19.4729 9.29727 19.4511 12.7582 19.4511 14.6591Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2340_20924">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </button>
                          </div>
                          <div
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.16)",
                              background:
                                "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                              backdropFilter: "blur(40px)",
                            }}
                            className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              GoogleSignIn();
                            }}
                          >
                            <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_2340_20911)">
                                  <path
                                    d="M23.094 9.91355L13.3046 9.91309C12.8724 9.91309 12.522 10.2634 12.522 10.6957V13.823C12.522 14.2552 12.8724 14.6056 13.3046 14.6056H18.8174C18.2137 16.1722 17.087 17.4842 15.6496 18.3178L18.0002 22.387C21.7709 20.2062 24.0002 16.3799 24.0002 12.0965C24.0002 11.4866 23.9553 11.0506 23.8653 10.5597C23.797 10.1867 23.4732 9.91355 23.094 9.91355Z"
                                    fill="#167EE6"
                                  />
                                  <path
                                    d="M11.9998 19.3044C9.30193 19.3044 6.94675 17.8304 5.68182 15.6492L1.61279 17.9945C3.6835 21.5834 7.56259 24.0001 11.9998 24.0001C14.1765 24.0001 16.2304 23.414 17.9998 22.3927V22.3871L15.6491 18.3179C14.5739 18.9415 13.3297 19.3044 11.9998 19.3044Z"
                                    fill="#12B347"
                                  />
                                  <path
                                    d="M18 22.3927V22.3871L15.6494 18.3179C14.5741 18.9414 13.33 19.3044 12 19.3044V24.0001C14.1767 24.0001 16.2308 23.414 18 22.3927Z"
                                    fill="#0F993E"
                                  />
                                  <path
                                    d="M4.69566 12C4.69566 10.6702 5.05856 9.42613 5.68205 8.35096L1.61302 6.00562C0.586031 7.76938 0 9.81773 0 12C0 14.1824 0.586031 16.2307 1.61302 17.9945L5.68205 15.6491C5.05856 14.5739 4.69566 13.3298 4.69566 12Z"
                                    fill="#FFD500"
                                  />
                                  <path
                                    d="M11.9998 4.69566C13.759 4.69566 15.375 5.32078 16.6372 6.36061C16.9486 6.61711 17.4012 6.59859 17.6864 6.31336L19.9022 4.09758C20.2258 3.77395 20.2028 3.24422 19.8571 2.94431C17.7423 1.10967 14.9907 0 11.9998 0C7.56259 0 3.6835 2.41673 1.61279 6.00558L5.68182 8.35092C6.94675 6.16969 9.30193 4.69566 11.9998 4.69566Z"
                                    fill="#FF4B26"
                                  />
                                  <path
                                    d="M16.6374 6.36061C16.9488 6.61711 17.4015 6.59859 17.6866 6.31336L19.9024 4.09758C20.226 3.77395 20.2029 3.24422 19.8573 2.94431C17.7425 1.10963 14.991 0 12 0V4.69566C13.7592 4.69566 15.3752 5.32078 16.6374 6.36061Z"
                                    fill="#D93F21"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2340_20911">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </a>
                          </div>
                          <div
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.16)",
                              background:
                                "linear-gradient(149deg, rgba(255, 255, 255, 0.20) 0.71%, rgba(255, 255, 255, 0.10) 98.8%)",
                              backdropFilter: "blur(40px)",
                            }}
                            className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              AppleSignIn();
                            }}
                          >
                            <a className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer flex items-center justify-center">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_2340_20920)">
                                  <path
                                    d="M16.6186 0H16.7893C16.9263 1.69253 16.2803 2.95719 15.4951 3.87301C14.7247 4.78251 13.6698 5.6646 11.9636 5.53076C11.8497 3.86247 12.4968 2.69161 13.2809 1.77789C14.0081 0.92636 15.3412 0.168621 16.6186 0ZM21.7836 17.6167V17.6641C21.3041 19.1163 20.6201 20.361 19.7855 21.516C19.0235 22.5646 18.0898 23.9758 16.4225 23.9758C14.9819 23.9758 14.025 23.0494 12.5485 23.0241C10.9866 22.9988 10.1277 23.7987 8.6997 24H8.21281C7.1642 23.8482 6.31793 23.0178 5.70141 22.2695C3.88347 20.0585 2.47865 17.2025 2.21729 13.5476V12.4737C2.32794 9.85799 3.59892 7.73126 5.28829 6.70057C6.17987 6.15255 7.40553 5.68568 8.77031 5.89435C9.35521 5.98498 9.95276 6.18522 10.4765 6.38335C10.9729 6.5741 11.5937 6.9124 12.1817 6.89448C12.5801 6.88289 12.9763 6.67527 13.3779 6.52878C14.554 6.10407 15.7069 5.61718 17.2266 5.84587C19.053 6.12199 20.3493 6.93347 21.1502 8.18548C19.6052 9.16875 18.3838 10.6505 18.5925 13.1809C18.778 15.4794 20.1143 16.8241 21.7836 17.6167Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_2340_20920">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </a>
                          </div>
                        </div>

                        <p
                          style={{
                            fontFamily: "Montserrat",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.80)",
                          }}
                        >
                          Agree to the{" "}
                          <u>
                            <Link
                              href="/terms"
                              target="_blank"
                              className="underline text-[#3DFFD0]"
                            >
                              Terms &amp; Conditions
                            </Link>
                          </u>{" "}
                          &amp;{" "}
                          <u>
                            <Link
                              href="/privacy-policy"
                              target="_blank"
                              className="underline text-[#3DFFD0]"
                            >
                              Privacy Policy
                            </Link>
                          </u>
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

// <div className="fixed inset-0  bg-transparent" style={{ zIndex: 1 }}>
//   <div className="flex items-center justify-center min-h-screen">
//     <div
//       className="absolute w-full lg:w-[50%] h-full flex items-center justify-center bg-white p-8 rounded-lg shadow-xl"
//       style={{
//         //   width: "420px",
//         //   height: `${
//         //     activeTab == "signin"
//         //       ? "680px"
//         //       : activeTab == "forgot"
//         //       ? "400px"
//         //       : "680px"
//         //   }`,
//         left: "50%",
//         top: "50%",
//         transform: "translate(-50%, -50%)",
//       }}
//     >
//       <div
//         className="fixed inset-0 transition-opacity bg-white px-8 py-4"
//         aria-hidden="true"
//       >
//         <div className="flex justify-center items-center flex-row">
//           <div className="w-full text-center text-[20px] font-semibold text-[#17161A]">
//             Get Started
//           </div>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleCloseModal();
//             }}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="text-[#17161A] cursor-pointer w-6 h-6"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 0 0 1.414-1.414L11.414 10z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//       <div className="absolute mt-10 lg:mt-24 w-full h-full">
//         <div
//           className={
//             activeTab == "signin"
//               ? "p-8 h-[680px] overflow-y-auto "
//               : "p-8 h-[600px] overflow-y-auto scrollbar-hidden"
//           }
//           style={{ scrollbarWidth: "none" }}
//         >
//           <div className="flex bg-[#EDEEEF] " style={{ borderRadius: 6 }}>
//             <button
//               className={`w-full  rounded-[6px] py-2 ml-1 mr-1 mt-1 mb-1 font-Inter font-semibold text-[14px] ${
//                 activeTab === "signin" ||
//                 ("forgot" && activeTab != "register")
//                   ? "bg-white"
//                   : ""
//               }`}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleTabChange("signin");
//               }}
//             >
//               Sign in
//             </button>
//             <button
//               className={`w-full  rounded-[6px] py-2 ml-1 mr-1 mt-1 mb-1 font-Inter font-semibold text-[14px] ${
//                 activeTab === "register" ? "bg-white" : ""
//               }`}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleTabChange("register");
//               }}
//             >
//               Register
//             </button>
//           </div>

//           {activeTab === "signin" ? (
//             <form className="mb-6 mt-6" onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label
//                   className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                   htmlFor="email"
//                 >
//                   Email address
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
//                   placeholder="Your email"
//                   style={{ color: email ? "black" : "rgba(0, 0, 0, 0.5)" }}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                   htmlFor="password"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={passwordShown ? "text" : "password"}
//                     style={{
//                       color: password ? "black" : "rgba(0, 0, 0, 0.5)",
//                     }}
//                     className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       togglePasswordVisiblity();
//                     }}
//                   >
//                     {passwordShown ? (
//                       <EyeIcon className="h-5 w-5 text-[#000000]" />
//                     ) : (
//                       <EyeOffIcon className="h-5 w-5 text-[#000000]" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//               {email != "" && signInError && (
//                 <div className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
//                   {signInError}
//                 </div>
//               )}

//               <div className="relative mt-12 w-full flex items-end justify-end">
//                 <span
//                   className="cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation();

//                     setActiveTab("forgot");
//                   }}
//                 >
//                   Forgot password?
//                 </span>
//               </div>

//               <div className="mt-6 mb-4">
//                 <button
//                   type="submit"
//                   className="bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
//                 >
//                   Sign in
//                 </button>
//               </div>
//               <div className="w-full flex items-center justify-center mb-6 mt-8">
//                 <p
//                   className="font-Inter text-[14px] font-normal"
//                   style={{ color: "rgba(0, 0, 0, 0.7)" }}
//                 >
//                   Other sign in options
//                 </p>
//               </div>
//               <div className="w-full flex items-center justify-center gap-4 mt-8">
//                 <div className="relative w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full">
//                   <button
//                     className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       LinkedinLogin();
//                     }}
//                   >
//                     <img
//                       src="/linkedin.svg"
//                       alt="Social Media Icon"
//                       className="w-full h-auto"
//                     />
//                   </button>
//                 </div>
//                 <div
//                   className="relative w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     GoogleSignIn();
//                   }}
//                 >
//                   <a
//
//                     className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                   >
//                     <img
//                       src="/GoogleIcon.svg"
//                       alt="Social Media Icon"
//                       className="w-full h-auto"
//                     />
//                   </a>
//                 </div>
//                 <div
//                   className="relative w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     AppleSignIn();
//                   }}
//                 >
//                   <a
//
//                     className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                   >
//                     <img
//                       src="/Apple.svg"
//                       alt="Social Media Icon"
//                       className="w-full h-auto"
//                     />
//                   </a>
//                 </div>
//                 <p
//                   style={{
//                     position: "absolute",
//                     marginTop: "120px",

//                     fontFamily: "Montserrat",
//                     fontStyle: "normal",
//                     fontWeight: 500,
//                     fontSize: "12px",
//                     lineHeight: "20px",
//                     color: "#999999",
//                   }}
//                 >
//                   Agree to the{" "}
//                   <u>
//                     <Link
//                       href="/terms"
//                       className="underline"
//                     >
//                       Terms &amp; Conditions
//                     </Link>
//                   </u>{" "}
//                   &amp;{" "}
//                   <u>
//                     <Link href="/privacy-policy" className="underline">
//                       Privacy Policy
//                     </Link>
//                   </u>
//                 </p>
//               </div>
//             </form>
//           ) : (
//             <div>
//               {activeTab == "forgot" ? (
//                 <div>
//                   {!resetPasswordSent ? (
//                     // reset password form
//                     <form onSubmit={handleResetPassword}>
//                       <div className="mt-12">
//                         <div>
//                           <label
//                             className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                             htmlFor="email"
//                           >
//                             Email address
//                           </label>
//                           <input
//                             type="text"
//                             className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
//                             style={{ color: "rgba(0, 0, 0, 0.5)" }}
//                             placeholder="Your email"
//                             value={resetEmail}
//                             onChange={(e) => setResetEmail(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                       <button
//                         type="submit"
//                         className="mt-12 bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
//                       >
//                         Reset Password
//                       </button>
//                       {reseterror && (
//                         <p className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
//                           {reseterror}
//                         </p>
//                       )}
//                     </form>
//                   ) : (
//                     // reset password success message
//                     <div
//                       className="text-center  flex items-end justify-end"
//                       style={{ height: "200px" }}
//                     >
//                       <div className="fixed top-0 bottom-0 right-0 left-0 bg-submain-blured">
//                         <div className="flex justify-center items-center w-full h-full text-sm md:text-base lg:text-lg xl:text-xl font-medium">
//                           <div
//                             className="px-4 py-2 rounded-xl xl:mt-12"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <div className="px-2 py-2 my-4 flex flex-col items-center justify-center">
//                               A mail regarding your request to reset your
//                               password has been sent to your email address.
//                             </div>

//                             <div className="w-full flex justify-center items-center px-4 my-4">
//                               <button
//                                 className="px-3 py-1.5 rounded-md bg-[#123B79] text-white active:scale-95  font-bold"
//                                 onClick={(e) => {
//                                   e.stopPropagation();

//                                   setActiveTab("signin");
//                                 }}
//                               >
//                                 Ok
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       {/* <p className="w-full font-semibold flex items-end justify-center">
//                         {" "}
//                         A mail regarding your request to reset your password
//                         has been sent to your email address.
//                       </p> */}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <form className="mb-6 mt-3" onSubmit={register}>
//                   <div className="mb-4">
//                     <label
//                       className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                       htmlFor="full name"
//                     >
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
//                       placeholder="Your Name"
//                       style={{
//                         color: name ? "black" : "rgba(0, 0, 0, 0.5)",
//                       }}
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label
//                       className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                       htmlFor="email"
//                     >
//                       Email address
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
//                       style={{
//                         color: email ? "black" : "rgba(0, 0, 0, 0.5)",
//                       }}
//                       placeholder="Your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                   </div>
//                   <label
//                     className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                     htmlFor="email"
//                   >
//                     Phone Number
//                   </label>
//                   <div>
//                     <PhoneInput
//                       country={"us"}
//                       value={phone}
//                       onChange={(value) => setPhone(value)}
//                       disableDropdown={false}
//                       masks={{ US: "+1 (...) ..-...." }}
//                       inputStyle={{
//                         width: "100%",
//                         height: "50px",
//                         fontSize: "16px",
//                         paddingLeft: "40px",
//                       }}
//                       containerStyle={{ position: "relative" }}
//                     />

//                     {/* <svg
//                       className="w-5 h-5 absolute top-1/2 -mt-2 left-3 text-gray-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M16.986 7.655A8.894 8.894 0 0013 6c-.993 0-1.95.162-2.838.484a1 1 0 10.766 1.896A6.91 6.91 0 0112 8a6.91 6.91 0 01-1.928-.28A1 1 0 009.41 9.1 8.891 8.891 0 007 13c0 .663.072 1.311.212 1.936a1 1 0 001.96-.41c-.111-.461-.17-.939-.17-1.526a7.91 7.91 0 012.188-5.295A7.91 7.91 0 0117 10c0 .588-.058 1.155-.17 1.702a1 1 0 101.96.412zM10 14a4 4 0 100-8 4 4 0 000 8z"
//                         clipRule="evenodd"
//                       />
//                     </svg> */}
//                   </div>

//                   <div className="mb-4">
//                     <label
//                       className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                       htmlFor="password"
//                     >
//                       Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={passwordShown ? "text" : "password"}
//                         className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
//                         placeholder="Password"
//                         value={password}
//                         style={{
//                           color: password ? "black" : "rgba(0, 0, 0, 0.5)",
//                         }}
//                         onChange={(e) => setPassword(e.target.value)}
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           togglePasswordVisiblity();
//                         }}
//                       >
//                         {passwordShown ? (
//                           <EyeIcon className="h-5 w-5 text-[#000000]" />
//                         ) : (
//                           <EyeOffIcon className="h-5 w-5 text-[#000000]" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <label
//                       className="block text-[#000000] text-[14px] font-normal font-Inter mb-2"
//                       htmlFor="password"
//                     >
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={passwordShown ? "text" : "password"}
//                         className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
//                         placeholder="Confirm Password"
//                         value={confirmPassword}
//                         style={{
//                           color: confirmPassword
//                             ? "black"
//                             : "rgba(0, 0, 0, 0.5)",
//                         }}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                       />
//                     </div>

//                     {password !== confirmPassword && (
//                       <div className="text-red-500 text-[14px] mb-2">
//                         Passwords do not match
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-6 mb-2">
//                     <button
//                       type="submit"
//                       className="bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
//                     >
//                       Register
//                     </button>
//                     {registerError && (
//                       <div className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
//                         {registerError}
//                       </div>
//                     )}
//                   </div>
//                   <div className="w-full flex items-center justify-center mb-4 mt-4">
//                     <p
//                       className="font-Inter text-[14px] font-normal"
//                       style={{ color: "rgba(0, 0, 0, 0.7)" }}
//                     >
//                       Other sign in options
//                     </p>
//                   </div>
//                   <div className="w-full flex items-center justify-center gap-4 mt-2">
//                     <div className="relative w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full">
//                       <a
//
//                         className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                       >
//                         <img
//                           src="/linkedin.svg"
//                           alt="Social Media Icon"
//                           className="w-full h-auto"
//                         />
//                       </a>
//                     </div>
//                     <div
//                       className="relative w-6 h-6 md:w-8 mds:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         GoogleSignIn();
//                       }}
//                     >
//                       <a
//
//                         className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                       >
//                         <img
//                           src="/GoogleIcon.svg"
//                           alt="Social Media Icon"
//                           className="w-full h-auto"
//                         />
//                       </a>
//                     </div>
//                     <div
//                       className="relative w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         AppleSignIn();
//                       }}
//                     >
//                       <a
//
//                         className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                       >
//                         <img
//                           src="/Apple.svg"
//                           alt="Social Media Icon"
//                           className="w-full h-auto"
//                         />
//                       </a>
//                     </div>
//                     {/* <div className="relative w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full">
//                       <a
//
//                         className="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex items-center justify-center"
//                       >
//                         <img
//                           src="/facebook.svg"
//                           alt="Social Media Icon"
//                           className="w-full h-auto"
//                         />
//                       </a>
//                     </div> */}
//                     <p
//                       style={{
//                         position: "absolute",
//                         marginTop: "80px",

//                         fontFamily: "Montserrat",
//                         fontStyle: "normal",
//                         fontWeight: 500,
//                         fontSize: "12px",
//                         lineHeight: "20px",
//                         color: "#999999",
//                       }}
//                     >
//                       Agree to the{" "}
//                       <u>
//                         <Link
//                           href="/terms"
//                           className="underline"
//                         >
//                           Terms &amp; Conditions
//                         </Link>
//                       </u>{" "}
//                       &amp;{" "}
//                       <u>
//                         <Link href="/privacy-policy" className="underline">
//                           Privacy Policy
//                         </Link>
//                       </u>
//                     </p>
//                   </div>
//                 </form>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
