import React from "react";
import BookShelf from "../components/Book/BookShelf";

const Home = (props) => {
  return (
    <div>
      <h1>Home Page</h1>
      <BookShelf />
    </div>
  );
};

export { Home as default };
