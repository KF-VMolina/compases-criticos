"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  getCookies,
  getCookie,
  setCookie,
  deleteCookie,
  hasCookie,
} from "cookies-next";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const SearchContent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCard, setSelectedCard] = useState({} as any);
  const [selectedAlbum, setSelectedAlbum] = useState({} as any);
  const BASEURL = "https://accounts.spotify.com/api";
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      searchInput: "",
    } as any,
    onSubmit: (values) => {
      console.log(values);
      setSearchInput(values.searchInput);
      setSubmitted(true);
    },
    validationSchema: Yup.object({
      searchInput: Yup.string().required("Este campo es requerido"),
    }),
  });

  useEffect(() => {
    // API Access Token
    fetch(`${BASEURL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET || "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAccessToken(data.access_token);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${searchInput}&type=album`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch albums");
        }

        const data = await response.json();
        setSearchResults(data.albums.items);
      } catch (err) {
        console.log(err);
      }
    };

    if (searchInput && accessToken) {
      fetchAlbums();
    }
  }, [searchInput, accessToken]);

  const handleCardSelection = (id: any) => {
    setSelectedCard(id);
  };

  const handleAlbumSelection = (album: any) => {
    setSelectedAlbum(album);
    // pass the selected album to the Post Creation page in a cookie

    setCookie("albumID", album.id);
    setCookie("albumName", album.name);
    setCookie("albumArtist", album.artists[0].name);
    setCookie("albumReleaseDate", album.release_date);
    setCookie("albumCover", album.images[1].url);
    setCookie("albumSpotify", album.external_urls.spotify);
    setCookie("albumTrackLength", album.total_tracks);
    setCookie("artistSpotify", album.artists[0].external_urls.spotify);

    router.push("/crear-post");
  };

  return (
    <div>
      <div className="flex justify-center mt-8">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center gap-3">
            <input
              className="input"
              type="text"
              placeholder="Buscar album"
              value={formik.values.searchInput}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="searchInput"
            />
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </div>
          {formik.touched.searchInput && formik.errors.searchInput ? (
            <div className="text-red-500 text-sm">
              {String(formik.errors.searchInput)}
            </div>
          ) : null}
        </form>
      </div>

      {submitted && (
        <div>
          <h1
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            Resultados
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {searchResults.map((album: any) => (
              <div
                className="card w-96 glass bg-base-100 shadow-xl m-8 cursor-pointer"
                key={album.id}
                onClick={() => handleCardSelection(album.id)}
              >
                <div>
                  <figure>
                    <Image
                      src={album.images[1].url}
                      alt={album.name}
                      width={300}
                      height={300}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {album.name}
                      <div className="badge badge-secondary">
                        {album.release_date.length === 4
                          ? album.release_date
                          : new Date(album.release_date).getFullYear()}
                      </div>
                    </h2>
                    <p>{album.artists[0].name}</p>
                  </div>
                </div>
                {selectedCard === album.id ? (
                  <div className="flex justify-center p-4">
                    <button
                      className="btn btn-primary btn-wide"
                      onClick={() => {
                        handleAlbumSelection(album);
                      }}
                    >
                      Seleccionar
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchContent;
