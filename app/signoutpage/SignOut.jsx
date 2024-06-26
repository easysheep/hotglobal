"use client";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { auth } from "../../Firebaseconfig";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
const Signout = () => {
  const { logedin, setlogedin } = useAuth();
  const router = useRouter();

  const logoutHandler = async () => {
    if (auth.currentUser) {
      try {
        await signOut(auth);
        localStorage.setItem("logedin", JSON.stringify(false));
        console.log("User is signed out");
        setlogedin(false);
        router.push("/");
        toast.error(" User signed out", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } catch (error) {
        console.error(error.code);
      }
    } else {
      console.log("No use Signed in");
      console.log(logedin);
    }
  };

  const browsingHandler = () => {
    router.push("/");};
 
  return (
    <>
      <div className="flex items-center justify-center top-24 relative w-full h-full bg-purple1">
        <div className="px-4 py-4 rounded-xl w-11/12 h-auto flex flex-col xl:flex-row">
          <div className="left-panel w-full xl:w-1/2 flex justify-center items-center">
            <div className="text-white font-bold text-6xl xl:text-8xl flex justify-center font-monte">
              SignOut.
            </div>
          </div>
          <div className="othcont w-full pt-5 xl:w-1/2 font-bold text-white justify-center flex flex-col ">
            <p className="text-3xl xl:text-4xl font-roboto justify-center flex">Are you sure?</p>
            <div className="twob1 flex gap-4 text-2xl mt-2 justify-center ">
              <button className="signout_buttons font-roboto" onClick={logoutHandler}>
                Yes
              </button>
              <button className="signout_buttons font-roboto" onClick={browsingHandler}>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  
};

export default Signout;
