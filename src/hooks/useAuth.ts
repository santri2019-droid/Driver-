import { useState, useEffect, FormEvent } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";

export function useAuth() {
  const [email, setEmail] = useState(() => localStorage.getItem("dc_auth_email") || "");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (email && password) {
      try {
        if (isRegisterMode) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
        localStorage.setItem("dc_auth_email", email);
      } catch (error: any) {
        let msg = "Ocurrió un error al autenticar.";
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          msg = "Credenciales incorrectas. Verifica tu contraseña o regístrate si no tienes cuenta.";
        } else if (error.code === "auth/email-already-in-use") {
          msg = "Este correo ya está registrado. Cambia a Iniciar Sesión.";
        } else if (error.code === "auth/weak-password") {
          msg = "La contraseña es muy débil (mínimo 6 caracteres).";
        } else if (error.code === "auth/invalid-email") {
          msg = "El formato del correo electrónico no es válido.";
        } else {
          msg = error.message;
        }
        setAuthError(msg);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError("Por favor, introduce tu correo electrónico primero.");
      return;
    }
    setAuthError("");
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Se ha enviado un correo para restablecer tu contraseña a: ${email}`);
    } catch (error: any) {
      let msg = "Error al enviar correo de recuperación.";
      if (error.code === "auth/invalid-email") {
        msg = "El formato del correo electrónico no es válido.";
      } else if (error.code === "auth/user-not-found") {
        msg = "No hay ningún usuario registrado con este correo.";
      } else {
        msg = error.message;
      }
      setAuthError(msg);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPassword("");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    user,
    isRegisterMode,
    setIsRegisterMode,
    authError,
    handleLogin,
    handleForgotPassword,
    handleLogout,
  };
}
