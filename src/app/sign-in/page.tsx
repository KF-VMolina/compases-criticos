"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Dirección de correo electrónico inválida")
      .required("Requerido"),
    password: Yup.string().required("Requerido"),
  });

  const handleSignIn = async (values: any) => {
    console.log("values", values);

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        sessionStorage.setItem("user", JSON.stringify(userCredential.user));
        const user = userCredential.user;
        console.log(user);
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "¡Bienvenido!",
          footer: `Bienvenido, ${user.email}`,
          timer: 2000,
        });
        router.push("/dashboard");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales inválidas, por favor intente de nuevo.",
          footer: errorMessage,
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Iniciar Sesión</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSignIn}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
              >
                Iniciar Sesión
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
