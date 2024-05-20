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
    router.push("/");
  };
  return (
    <>
      <div className="flex items-center justify-center top-24 relative w-100 h-full bg-purple1 ">
        <div className=" px-4 py-4 rounded-xl w-11/12 h-72 flex">
        <div className="left-panel  w-1/2 flex justify-center items-center">
          <div className="text-white font-bold  text-8xl flex justify-center">
            SignOut.
          </div>
        </div>
          <div className="othcont w-1/2 font-bold text-white justify-center flex flex-col">
            <p className="text-4xl">Are you sure ?</p>
            <div className="twob1 flex gap-4 text-2xl mt-2">
              <button className="signout_buttons" onClick={logoutHandler}>
                Yes
              </button>
              <button className="signout_buttons" onClick={browsingHandler}>
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
