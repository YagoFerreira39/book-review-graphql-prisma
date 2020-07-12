import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Image,
  List,
  Rating,
  Loader,
  Dropdown,
  Button,
} from "semantic-ui-react";
import shelfOptions from "../../utils/shelfOptions";
import "./userPage.css";

const UserBooks = ({
  wantToRead,
  currentRead,
  completeRead,
  loading,
  error,
}) => {
  const [rate, setRate] = useState({});

  const books = [];
  if (wantToRead) {
    wantToRead.map((book) => {
      book.list = "wantToRead";
      books.push(book);
    });
  }
  if (currentRead) {
    currentRead.map((book) => {
      book.list = "currentRead";
      books.push(book);
    });
  }
  if (completeRead) {
    completeRead.map((book) => {
      book.list = "completeRead";
      books.push(book);
    });
  }
  console.log("usersBook", books);

  function handleRate(e, { rating }) {
    setRate(rating);
  }
  return (
    <div>
      {loading ? (
        <Loader active>Loading...</Loader>
      ) : (
        <List className="shelf-list" celled>
          {books &&
            books.map((book) => (
              <List.Item key={book.id} className="user-books-shelf">
                <Image avatar src="" />
                <List.Content>
                  <List.Header
                    id="book-title"
                    as={Link}
                    to={`/book/detail/${book.id}`}
                  >
                    {book.title}
                  </List.Header>
                  <List.Content as={Link} to={`/${book.author.name}`}>
                    {book.author.name}
                  </List.Content>
                </List.Content>
                <Rating maxRating={5} onRate={handleRate} clearable />
                <Dropdown
                  id="book-shelf-dropdown"
                  defaultValue={1}
                  selection
                  options={shelfOptions}
                />
                <Button
                  className="write-rvw-btn"
                  as={Link}
                  to={`/review/book/${book.id}`}
                >
                  Write a review
                </Button>
                <Button.Group vertical>
                  <Button className="review-btn" as={Link}>
                    View
                  </Button>
                  <Button className="review-btn" as={Link}>
                    Edit
                  </Button>
                </Button.Group>
              </List.Item>
            ))}
        </List>
      )}
    </div>
  );
};

export default UserBooks;
