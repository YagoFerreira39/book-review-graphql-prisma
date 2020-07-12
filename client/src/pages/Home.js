import React from "react";
import BookShelf from "../components/Book/BookShelf";
import UserProfile from "../components/User/UserProfile";
import UserBooks from "../components/User/UserBooks";

const Home = (props) => {
  return (
    <div>
      <h1>Home Page</h1>
      <UserProfile />
    </div>
  );
};

export { Home as default };
