import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { BOOK_QUERY } from "../../Queries/BookQuery";
import { Grid, Image, Segment, Dimmer, Loader } from "semantic-ui-react";
import BookCard from "./BookCard";

const BookShelf = (props) => {
  const [fetchedBooks, setFetchedBooks] = useState({});

  const { loading, error, data, refetch } = useQuery(BOOK_QUERY);
  useEffect(() => {
    if (data) {
      setFetchedBooks(data.books);
    }
    refetch();
  }, [data]);

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1>Books</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <Segment>
            <Dimmer>
              <Loader />
            </Dimmer>
          </Segment>
        ) : (
          fetchedBooks.length &&
          fetchedBooks.map((book) => (
            <Grid.Column className="book-card" key={book.id}>
              <BookCard book={book} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

export default BookShelf;
