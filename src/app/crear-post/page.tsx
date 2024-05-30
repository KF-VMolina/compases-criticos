"use client";
import { getCookie, getCookies, hasCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik, FieldProps } from "formik";
import * as Yup from "yup";
import Image from "next/image"; // Import the Image component from next/image
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";

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
  const [albumDetails, setAlbumDetails] = useState({});
  const [rating, setRating] = useState(0);
  const [value, setValue] = useState<number | null>(2);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    const details = {
      albumId: getCookie("albumID"),
      albumName: getCookie("albumName"),
      albumArtist: getCookie("albumArtist"),
      albumReleaseDate: getCookie("albumReleaseDate"),
      albumCover: getCookie("albumCover"),
      albumSpotify: getCookie("albumSpotify"),
      albumTrackLength: getCookie("albumTrackLength"),
    };
    setAlbumDetails(details);
    setLoading(false);
  }, []);

  const validationSchema = Yup.object({
    comment: Yup.string()
      .required("Campo requerido")
      .min(120, "El comentario debe tener al menos 120 caracteres"),
    rating: Yup.number()
      .required("Campo requerido")
      .min(0.5, "Seleccionar una calificación entre 0.5 y 5")
      .max(5, "Seleccionar una calificación entre 0.5 y 5"),
  });

  const albumId = getCookie("albumID");
  const albumName = getCookie("albumName");
  const albumArtist = getCookie("albumArtist");
  const albumReleaseDate = getCookie("albumReleaseDate");
  const albumCover = getCookie("albumCover");
  const albumSpotify = getCookie("albumSpotify");
  const albumTrackLength = getCookie("albumTrackLength");
  const artistSpotify = getCookie("artistSpotify");

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
              <span>Crear Reseña para </span>
              <a
                href={albumSpotify}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {albumName}
              </a>
              <span> de </span>
              <a
                href={artistSpotify}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {albumArtist}
              </a>
            </h1>
            <Image
              src={albumCover?.toString() ?? ""}
              alt="Album Cover"
              className="mx-auto"
              width={300}
              height={300}
            />{" "}
            {/* Stats Bar */}
            <div className="stats stats-vertical lg:stats-horizontal shadow m-8">
              <div className="stat">
                <div className="stat-title">Año de lanzamiento</div>
                <div className="stat-value">
                  {new Date(albumReleaseDate ?? "").getFullYear()}
                </div>
                <div className="stat-desc">
                  {new Date(albumReleaseDate ?? "").toLocaleDateString("en-GB")}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Número de canciones</div>
                <div className="stat-value">{albumTrackLength}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Escuchar en Spotify</div>
                <div className="stat-actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => window.open(albumSpotify)}
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
              initialValues={{ comment: "", rating: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                // handle form submission here
                console.log(values);
                setSubmitting(false);
              }}
            >
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comentarios
                  </label>
                  <div className="flex justify-center">
                    <Field
                      as="textarea"
                      id="comment"
                      name="comment"
                      className="mt-1 p-2 block w-full sm:w-3/4 md:w-3/4 lg:w-3/4 xl:w-2/4 border border-gray-300 rounded-md"
                      rows="8"
                      placeholder="Escribe tu comentario..."
                    />
                  </div>

                  <ErrorMessage
                    name="comment"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
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
