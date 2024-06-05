"use client";
import { auth } from "@/app/firebase/config";
import React, { useEffect, useState } from "react";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";

const EditarPerfil: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isClient, setIsClient] = useState(false);
  const [uid, setUid] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  // get theme cookie and set theme
  const [themeCookie, setThemeCookie] = useState(getCookie("theme"));
  const [theme, setTheme] = useState(themeCookie || "light");
  const [password, setPassword] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  {
    /* User validation */
  }
  useEffect(() => {
    setIsClient(true);
  }, []);

  let userSession: string | null = null;

  if (typeof window !== "undefined") {
    userSession = window.sessionStorage.getItem("user");
  }

  if (!user && !userSession) {
    router.push("/sign-in");
  }

  useEffect(() => {
    if (user) {
      setUid(user.uid);
      console.log(user.uid);
      setIsLoading(true);
    } else {
      const user = JSON.parse(userSession || "");
      setUid(user.uid);
    }
  }, [user, userSession]);

  {
    /* Page Functions */
  }

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setProfilePicture(e.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  {
    /* Theme Change */
  }

  const themeColorOptions = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];
  const changeUserTheme = (theme: string) => {
    setTheme(theme);
    setThemeCookie(theme);
    console.log("Theme changed to", theme);
  };

  const confirmThemeChange = (theme: string) => {
    setCookie("theme", theme);
    console.log("Theme cookie set to", theme);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    // Upload to Firebase Storage
    if (profilePicture) {
      const storageRef = ref(storage, `profilePictures/${profilePicture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  return (
    //change theme according to user preference
    <div className="theme-change" data-theme={themeCookie}>
      <main className="container mx-auto p-4">
        {/* Edit profile settings Section */}
        <section className="py-20 w-96 md:w-1/2 lg:w-1/2 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Editar Perfil
          </h2>
          <div className="grid gap-8 grid-cols-1 justify-center text-center">
            {/* Profile Picture Section */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title justify-center">Foto de Perfil</h3>
                <p>Actualiza tu foto de perfil</p>
                <form onSubmit={handleSubmit}>
                  <label className="block mb-4">
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleProfilePictureChange}
                      className="file-input file-input-bordered file-input-md w-full max-w-xs"
                    />
                  </label>
                  <div className="flex flex-col items-center">
                    <button className="btn btn-primary mb-4">
                      Actualizar foto
                    </button>
                    <progress
                      className={`progress w-56 ${
                        uploadProgress === 100 ? "progress-success" : "progress"
                      }`}
                      value={uploadProgress}
                      max="100"
                    ></progress>
                  </div>
                </form>
              </div>
            </div>

            {/* Username Section */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title justify-center">Nombre de Usuario</h3>
                <p>Actualiza tu nombre de usuario</p>
                <form onSubmit={handleSubmit}>
                  <label className="block mb-4">
                    <span className="text-lg">Nombre de Usuario:</span>
                    <input
                      type="text"
                      name="username"
                      className="input input-bordered w-full mt-2"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </label>
                  <button type="submit" className="btn btn-primary">
                    Actualizar Nombre
                  </button>
                </form>
              </div>
            </div>

            {/* Theme Section */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title justify-center">Tema</h3>
                <p>Selecciona tu tema preferido</p>
                <form onSubmit={handleSubmit}>
                  <label className="block mb-4">
                    <span className="text-lg">Tema:</span>
                    <select
                      name="theme"
                      className="select select-bordered w-full mt-2"
                      value={theme}
                      onChange={(e) => {
                        e.preventDefault();
                        changeUserTheme(e.target.value);
                      }}
                    >
                      {themeColorOptions.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      confirmThemeChange(theme);
                    }}
                  >
                    Actualizar Tema
                  </button>
                </form>
              </div>
            </div>

            {/* Password Section */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h3 className="card-title justify-center">Contraseña</h3>
                <p>Actualiza tu contraseña</p>
                <form onSubmit={handleSubmit}>
                  <label className="block mb-4">
                    <span className="text-lg">Contraseña:</span>
                    <input
                      type="password"
                      name="password"
                      className="input input-bordered w-full mt-2"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </label>
                  <button type="submit" className="btn btn-primary">
                    Actualizar Contraseña
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditarPerfil;
