"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebaseconfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [displayError, setDisplayError] = useState("");
  const { logedin, setlogedin } = useAuth();
  const { currentUser, setCurrentUser } = useAuth();
  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      setCurrentUser(user);
      setlogedin(true);
      localStorage.setItem("logedin", JSON.stringify(true));

      console.log("User");
      console.log("created user");
      console.log(logedin);
      console.log(currentUser);

      router.push("/");
      toast.success("User logged in ", {
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

      console.log(user);
    } catch (error) {
      console.error(error.code);
      setError(error.code);
    }
  };

  useEffect(() => {
    if (
      error === "auth/invalid-login-credentials" ||
      error === "auth/invalid-credential"
    ) {
      setDisplayError("Invalid login credentials");
      toast.warn("Invalid login credentials", {
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
    } else if (error === "auth/invalid-email") {
      setDisplayError("Invalid Email");
      toast.warn("Invalid Email", {
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
    }
  }, [error]);

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };
  return (
    <div className="flex items-center justify-center top-24 relative w-100 h-full bg-purple1  ">
      <div className="  px-4 py-4 rounded-xl w-11/12 h-72 flex">
        <div className="left-panel  w-1/2 flex justify-center items-center">
          <div className="text-white font-bold  text-8xl flex justify-center font-raleway">
            Login.
          </div>
        </div>
        <div className="overlay-box  w-1/2">
          <div className="pays10 ">
            <form onSubmit={submitHandler}>
              <br />
              <div className="at0">
                <div className="pb-3">
                  <div className="cp1 font-roboto">
                    <label
                      className="font-bold text-white font-roboto"
                      htmlFor="emailInput"
                    >
                      Email:
                    </label>
                    <div className="amnt">
                      <input
                        className="px-1 font-roboto"
                        name="email"
                        type="email"
                        placeholder="123@x.com"
                        onChange={emailHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="pb-3">
                  <div className="text-white font-roboto">
                    <label className="font-bold font-roboto" htmlFor="passwordInput">
                      Enter Password:
                    </label>
                    <div className="text-black">
                      <input
                        className="px-1"
                        name="password"
                        type="password"
                        placeholder=" ******* "
                        onChange={passwordHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="btnbtnc ">
                <button
                  className="btnbtn font-roboto bg-white px-2 py-1 shadow-2xl rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
