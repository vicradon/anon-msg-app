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
  setUsername: React.Dispatch<React.SetStateAction<any>>;
  setIsSignedIn: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  deleted: boolean;
  setDeleted: React.Dispatch<React.SetStateAction<any>>;
};

const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: null,
  isSignedIn: false,
  username: "",
  setUsername: null,
  setIsSignedIn: null,
  loading: true,
  setLoading: null,
  deleted: false,
  setDeleted: null,
});

function AuthProvider(props: Props) {
  const { children } = props;
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      setLoading(false);
      setIsSignedIn(!!user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        username,
        setUser,
        isSignedIn,
        setIsSignedIn,
        setUsername,
        loading,
        setLoading,
        deleted,
        setDeleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
