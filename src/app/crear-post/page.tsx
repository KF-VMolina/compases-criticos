"use client";
import { getCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik, FieldProps } from "formik";
import * as Yup from "yup";
import Image from "next/image"; // Import the Image component from next/image
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import Swal from "sweetalert2";

const labels: { [index: string]: string } = {
  0.5: "Inescuchable",
  1: "Pésimo",
  1.5: "Muy Malo",
  2: "Malo",
  2.5: "Regular",
  3: "Bueno",
  3.5: "Muy Bueno",
  4: "Excelente",
  4.5: "Grandioso",
  5: "Obra Maestra",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const CreateBlogPost = () => {
  const [loading, setLoading] = useState(true);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails>({
    albumSpotify: "",
    albumName: "",
    albumArtist: "",
    albumTrackLength: "",
    albumSongs: "",
    artistSpotify: "",
  });
  const [hover, setHover] = useState(-1);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  interface AlbumDetails {
    albumSpotify?: string;
    albumName?: string;
    albumArtist?: string;
    albumCover?: string;
    albumReleaseDate?: string;
    albumTrackLength?: string;
    albumSongs?: string;
    artistSpotify?: string;
  }

  useEffect(() => {
    const details = {
      albumId: getCookie("albumID") ?? "", // Provide a default value of an empty string
      albumName: getCookie("albumName") ?? "", // Provide a default value of an empty string
      albumArtist: getCookie("albumArtist") || "", // Provide a default value of an empty string
      albumReleaseDate: getCookie("albumReleaseDate") || "", // Provide a default value of an empty string
      albumCover: getCookie("albumCover") || "", // Provide a default value of an empty string
      albumSpotify: getCookie("albumSpotify") || "", // Provide a default value of an empty string
      albumTrackLength: getCookie("albumTrackLength") || "", // Provide a default value of 0
      artistSpotify: getCookie("artistSpotify") || "", // Provide a default value of an empty string
      albumSongs: getCookie("albumSongs") || "", // Provide a default value of an empty string
    };
    setAlbumDetails(details);
    setLoading(false);
  }, []);

  const validationSchema = Yup.object({
    comment: Yup.string()
      .required("Campo requerido")
      .min(120, "El comentario debe tener al menos 120 caracteres"),
  });

  //convert to array and remove square brackets and double quotes
  //give the songs a key value pair for the checkbox
  {
    /*
  const albumSongs =
    getCookie("albumSongs")
      ?.split(",")
      .map((song: any, index: number) => ({
        id: index + 1, // Assign a unique number ID starting from 1
        name: song.replace(/[\[\]"]/g, ""), // Remove square brackets and double quotes from song names
      })) ?? [];

  console.log("albumSongs", albumSongs);
  */
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="hero min-h-screen bg-base-200 p-8">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">
              <span>Crear Entrada de Blog para </span>
              <a
                href={albumDetails.albumSpotify}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {albumDetails.albumName}
              </a>
              <span> de </span>
              <a
                href={albumDetails.artistSpotify}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {albumDetails.albumArtist}
              </a>
            </h1>
            <Image
              src={albumDetails.albumCover?.toString() ?? ""}
              alt="Album Cover"
              className="mx-auto"
              width={300}
              height={300}
              priority
            />{" "}
            {/* Stats Bar */}
            <div className="stats stats-vertical lg:stats-horizontal shadow m-8">
              <div className="stat">
                <div className="stat-title">Año de lanzamiento</div>
                <div className="stat-value">
                  {new Date(albumDetails.albumReleaseDate ?? "").getFullYear()}
                </div>
                <div className="stat-desc">
                  {new Date(
                    albumDetails.albumReleaseDate ?? ""
                  ).toLocaleDateString("en-GB")}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Número de canciones</div>
                <div className="stat-value">
                  {albumDetails.albumTrackLength}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Escuchar en Spotify</div>
                <div className="stat-actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => window.open(albumDetails.albumSpotify)}
                    color="transparent"
                  >
                    <Image
                      src="/spotify.svg"
                      alt="Spotify Logo"
                      className="inline-block w-8 h-8"
                      width={8}
                      height={8}
                    />
                  </button>
                </div>
              </div>
            </div>
            <Formik
              initialValues={{
                comment: "",
                //rating: "",
                //topSongs: [] as string[],
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                // if comment is at least 120 characters, ask user if they want to submit
                if (values.comment.length >= 120) {
                  //ask user if they want to submit
                  Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Estás a punto de publicar tu comentario. ¿Deseas continuar?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, publicar",
                    cancelButtonText: "No, cancelar",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire(
                        "Publicado",
                        "Tu comentario ha sido publicado con éxito",
                        "success"
                      );
                    }
                    console.log(values);
                    setSubmitting(false);
                  });
                }
              }}
            >
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Resumen de este álbum
                  </label>
                  <div className="flex justify-center">
                    <Field
                      as="textarea"
                      id="comment"
                      name="comment"
                      className="mt-1 p-2 block w-full sm:w-3/4 md:w-3/4 lg:w-3/4 xl:w-2/4 border border-gray-300 rounded-md"
                      rows="8"
                      placeholder="Escribe un resumen sobre este disco..."
                    />
                  </div>

                  <ErrorMessage
                    name="comment"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Top Songs 
                  <div>
                    <label
                      htmlFor="topSongs"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Canciones Favoritas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <ul className="list-disc list-inside">
                        {albumSongs.map(
                          (song: { id: number; name: string }) => (
                            <li
                              key={song.id}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                id={`song-${song.id}`}
                                name="topSongs"
                                value={song.name}
                                checked={values.topSongs.includes(
                                  song.name.toString()
                                )} // Ensure checkbox reflects Formik's state
                                onChange={() => {
                                  const songName = song.name.toString();
                                  const newSelection = values.topSongs.includes(
                                    songName
                                  )
                                    ? values.topSongs.filter(
                                        (name) => name !== songName
                                      )
                                    : [...values.topSongs, songName];
                                  setFieldValue("topSongs", newSelection); // Update Formik's state
                                }}
                              />
                              <label htmlFor={`song-${song.id}`}>
                                {song.name}
                              </label>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <ErrorMessage
                      name="topSongs"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  */}
                {/* Rating 
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rating
                    </label>
                    <Field name="rating">
                      {({ field }: FieldProps<any>) => (
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Rating
                            name="hover-feedback"
                            id="rating"
                            value={field.value}
                            defaultValue={2.5}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                              if (newValue !== null) {
                                field.onChange({
                                  target: { name: "rating", value: newValue },
                                });
                              }
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover(newHover);
                            }}
                            emptyIcon={
                              <StarIcon
                                style={{ opacity: 0.55, fontSize: "50px" }}
                              />
                            }
                            icon={<StarIcon style={{ fontSize: "50px" }} />}
                          />
                          {field.value !== null && (
                            <Box sx={{ mt: 2, whiteSpace: "nowrap" }}>
                              {labels[hover !== -1 ? hover : field.value]}
                            </Box>
                          )}
                        </Box>
                      )}
                    </Field>
                    <ErrorMessage
                      name="rating"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  */}
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Terminar
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;
