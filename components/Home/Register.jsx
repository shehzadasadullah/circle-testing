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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success("Logged In Successfully!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      handleCloseModal();
    } catch (error) {
      toast.error("Error!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      console.error(error);
      // Add any additional error handling or logging here
    }
  };

  //reset Password Functionality
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);

      setResetPasswordSent(true);
    } catch (error) {
      setResetError(error.message);
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
      toast.success("Logged In Successfully!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("Error!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  //emai password Sigin in function
  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
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
      toast.success("Registration Successful!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      setActiveTab("signin");
    } catch (error) {
      toast.error("Error", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      setRegisterError(error.message);
    }
  };

  //email password login method
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged In Successfully!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      handleCloseModal();
    } catch (error) {
      toast.error("Error!", {
        position: "top-right",
        autoClose: 3000, // Time in milliseconds
      });
      setSignInError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
    //                       href="/terms-and-conditions"
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
    //                       Re-enter Password
    //                     </label>
    //                     <div className="relative">
    //                       <input
    //                         type={passwordShown ? "text" : "password"}
    //                         className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
    //                         placeholder="Re-enter Password"
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
    //                           href="/terms-and-conditions"
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
    <div className="fixed z-10 inset-0 overflow-y-auto">
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

        <div className="inline-block w-full lg:w-[40%] align-middle bg-[#fff] rounded-lg shadow-xl transform transition-all">
          <div className="w-full flex justify-center border-b-2 items-center px-6 py-3">
            <p className="font-semibold w-full text-xl">Get Started</p>
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
                className="h-6 w-6"
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
              className="flex w-full bg-[#EDEEEF] "
              style={{ borderRadius: 6 }}
            >
              <button
                className={`w-full rounded-[6px] py-2 ml-1 mr-1 mt-1 mb-1 font-Inter font-semibold text-[14px] ${
                  activeTab === "signin" ||
                  ("forgot" && activeTab != "register")
                    ? "bg-white"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange("signin");
                }}
              >
                Sign in
              </button>
              <button
                className={`w-full  rounded-[6px] py-2 ml-1 mr-1 mt-1 mb-1 font-Inter font-semibold text-[14px] ${
                  activeTab === "register" ? "bg-white" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabChange("register");
                }}
              >
                Register
              </button>
            </div>

            {activeTab === "signin" ? (
              loginWithNumber ? (
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
                        className="bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
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
                          <Link
                            href="/terms-and-conditions"
                            className="underline"
                          >
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
                <>
                  <form className="w-full p-8" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-[#000000] text-left text-[14px] font-normal font-Inter mb-2"
                        htmlFor="email"
                      >
                        Email address
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
                        placeholder="Your email"
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
                        className="bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
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
                          setLoginWithNumber(true);
                        }}
                        className="font-Inter text-[#123B79] text-[16px] mt-4 cursor-pointer hover:underline font-semibold"
                      >
                        Sign in using Phone Number
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
                          <Link
                            href="/terms-and-conditions"
                            className="underline"
                          >
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
              )
            ) : (
              <div className="w-full">
                {activeTab == "forgot" ? (
                  <div>
                    {!resetPasswordSent ? (
                      // reset password form
                      <form className="w-full" onSubmit={handleResetPassword}>
                        <div className="mt-12 w-full">
                          <div>
                            <label
                              className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                              htmlFor="email"
                            >
                              Email address
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
                              style={{ color: "rgba(0, 0, 0, 0.5)" }}
                              placeholder="Your email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-12 bg-[#123B79] text-white font-Inter font-semibold text-[16px] w-full py-3 rounded focus:outline-none focus:shadow-outline"
                        >
                          Reset Password
                        </button>
                        {reseterror && (
                          <p className="w-full flex items-center justify-center text-red-500 text-[14px] mb-2">
                            {reseterror}
                          </p>
                        )}
                      </form>
                    ) : (
                      // reset password success message
                      <div
                        className="text-center  flex items-end justify-end"
                        style={{ height: "200px" }}
                      >
                        <div className="fixed top-0 bottom-0 right-0 left-0 bg-submain-blured">
                          <div className="flex justify-center items-center w-full h-full text-sm md:text-base lg:text-lg xl:text-xl font-medium">
                            <div
                              className="px-4 py-2 rounded-xl xl:mt-12"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="px-2 py-2 my-4 flex flex-col items-center justify-center">
                                A mail regarding your request to reset your
                                password has been sent to your email address.
                              </div>

                              <div className="w-full flex justify-center items-center px-4 my-4">
                                <button
                                  className="px-3 py-1.5 rounded-md bg-[#123B79] text-white active:scale-95  font-bold"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    setActiveTab("signin");
                                  }}
                                >
                                  Ok
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <p className="w-full font-semibold flex items-end justify-center">
                            {" "}
                            A mail regarding your request to reset your password
                            has been sent to your email address.
                          </p> */}
                      </div>
                    )}
                  </div>
                ) : registerWithNumber ? (
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
                          Re-enter Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
                            placeholder="Re-enter Password"
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
                            <Link
                              href="/terms-and-conditions"
                              className="underline"
                            >
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
                      <div className="mb-4">
                        <label
                          className="block text-left text-[#000000] text-[14px] font-normal font-Inter mb-2"
                          htmlFor="email"
                        >
                          Email address
                        </label>
                        <input
                          type="text"
                          className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4 font-Inter font-normal placeholder-style text-[16px] focus:border-gray-300 hover:border-gray-300"
                          style={{
                            color: email ? "black" : "rgba(0, 0, 0, 0.5)",
                          }}
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          Re-enter Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            className="w-full h-12 sm:h-23 bg-white border border-gray-300 rounded-md px-4  font-Inter font-normal placeholder-style text-[16px]"
                            placeholder="Re-enter Password"
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
                            setRegisterWithNumber(true);
                          }}
                          className="font-Inter text-[#123B79] text-[16px] mt-4 cursor-pointer hover:underline font-semibold"
                        >
                          Sign Up using Phone Number
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
                            <Link
                              href="/terms-and-conditions"
                              className="underline"
                            >
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
