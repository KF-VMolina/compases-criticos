"use client";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  let userSession;
  if (typeof window !== 'undefined') {
    userSession = window.sessionStorage.getItem('user');
  }

  console.log("user", user);
  

  if (!user && !userSession) {
    router.push("/sign-in");
  }

  return (
    <div>
      <button
        onClick={() =>
          signOut(auth)
            .then(() => {
              sessionStorage.removeItem("user");
              router.push("/sign-in");
            })
            .catch((error) => {
              console.log(error);
            })
        }
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
