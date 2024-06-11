"use client";
import { getCookie } from "cookies-next";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/app/firebase/config";
import { set } from "firebase/database";

const Home = () => {
  const [theme, setTheme] = useState("");
  const [posts, setPosts] = useState<
    {
      id: string;
      albumCoverURL: string;
      albumName: string;
      albumArtist: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const themeCookie = getCookie("theme");
    setTheme(themeCookie || "dark");
  }, []);

  // Query to get all posts from firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "blogPost");
        const q = query(postsRef);
        const querySnapshot = await getDocs(q);
        const fetchedPosts: {
          id: string;
          albumCoverURL: string;
          albumName: string;
          albumArtist: string;
        }[] = [];
        querySnapshot.forEach((doc) => {
          const { albumCoverURL, albumName, albumArtist } = doc.data();
          fetchedPosts.push({
            id: doc.id,
            albumCoverURL,
            albumName,
            albumArtist,
          });
        });
        setPosts(fetchedPosts);
        console.log("Posts fetched:", fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle the error appropriately in your UI
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this effect runs once on mount

  // Loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="theme-change" data-theme={theme}>
      <div className="hero min-h-screen bg-base-200 p-8">
        <main className="container mx-auto p-4 px-4">
          {/* Hero Section */}
          <section className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white">
            <h2 className="text-4xl font-bold mb-4">
              Bienvenido a Compases Críticos
            </h2>
            <p className="text-xl mb-6">...</p>
          </section>

          {/* Blog Section */}
          <section className="py-20">
            <h2 className="text-3xl font-bold text-center mb-12">Blog</h2>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="card lg:card-side bg-base-100 shadow-xl"
                >
                  <figure>
                    <Image
                      src={post.albumCoverURL}
                      alt="Post"
                      width={300}
                      height={300}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{post.albumName}</h2>
                    <p>{post.albumArtist}</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Ver Más</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
