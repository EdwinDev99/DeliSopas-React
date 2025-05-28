import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth"; // importa el tipo 'User'
import { auth } from "../src/assets/firebase/firebase";
import Restaurant from "./assets/Components/Restaurant";
import Login from "./assets/Components/pages/Login";

function App() {
  const [user, setUser] = useState<User | null>(null); // especifica el tipo correctamente

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return <div className="container">{user ? <Restaurant /> : <Login />}</div>;
}

export default App;
