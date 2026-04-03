import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";

const Home = () => {
  const userAge = 19;

  return (
    <div className="home-page">
      <Header />

      {/* On ajoute la classe home-content ici pour le Flexbox */}
      <div className="home-content">
        <Sidebar age={userAge} />

        <main>
          <h2>Fil d'actualité Safe World 🌿</h2>
          <Feed />
        </main>
      </div>
    </div>
  );
};

export default Home;
