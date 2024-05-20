"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebaseconfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [displayError, setDisplayError] = useState("");
  const { setlogedin } = useAuth();
  const { setCurrentUser } = useAuth();
  const router = useRouter();

  
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      setlogedin(true);
      setCurrentUser(user);
      localStorage.setItem("logedin", JSON.stringify(true));

      router.push("/");
      toast.success("User signed in ", {
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
  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (error === "auth/invalid-login-credentials") {
      setDisplayError("Invalid login credentials");
    } else if (error === "auth/invalid-email") {
      setDisplayError("Invalid Email");
    } else if (error === "auth/missing-password") {
      setDisplayError("Password is required ");
    } else if (error === "auth/weak-password") {
      setDisplayError("Weak password");
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center top-24 relative w-100 h-full bg-purple1  ">
      <div className="  px-4 py-4 rounded-xl w-11/12 h-72 flex">
        <div className="left-panel  w-1/2 flex justify-center items-center">
          <div className="text-white font-bold  text-8xl flex justify-center">
            SignUp.
          </div>
        </div>
        <div className="overlay-box w-1/2">
          <div className="pays10 ">
            <form onSubmit={submitHandler}>
              <br />

              <div className="at0">
                <div className=" pb-3">
                  <div className="">
                    <label className="font-bold text-white" for="amountInput">
                      Email:
                    </label>
                    <div className="text-black">
                      <input
                        className="px-1  "
                        name="cardNumber"
                        type="email"
                        placeholder="123@x.com"
                        onChange={emailHandler}
                      />
                    </div>
                  </div>
                </div>

                <div className="pb-3">
                  <div className="text-white">
                    <label className="font-bold" for="amountInput">
                      Enter Password:
                    </label>
                    <div className="text-black">
                      <input
                        className="px-1"
                        name="pin"
                        type="password"
                        placeholder=" ******* "
                        onChange={passwordHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <button className="mt-4 bg-white px-2 py-1 shadow-2xl rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-200">
                  SignUp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
