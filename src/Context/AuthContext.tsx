import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState, createContext } from "react";
import { firebaseDb } from "../utils/firebase.config";

interface Props {
  children: React.ReactNode;
}

type ContextProps = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isSignedIn: boolean;
  username: string;
  setIsSignedIn: React.Dispatch<React.SetStateAction<any>>;
};

const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: null,
  isSignedIn: false,
  username: "",
  setIsSignedIn: null,
});

function AuthProvider(props: Props) {
  const { children } = props;
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(firebaseDb, "anonymous-msgs", user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsername(docSnap.data()?.username);
        }
      }
      setIsSignedIn(!!user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, username, setUser, isSignedIn, setIsSignedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
