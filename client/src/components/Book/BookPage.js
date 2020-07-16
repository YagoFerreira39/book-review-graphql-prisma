import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { SINGLE_BOOK_QUERY } from "../../Queries/BookQuery";
import BookDetails from "./BookDetails";
import DefaultClient from "apollo-boost";

const BookPage = (props) => {
  const bookId = window.location.pathname.split(/[/]+/).pop();
  const [book, setBook] = useState({});
  const { loading, error, data } = useQuery(SINGLE_BOOK_QUERY, {
    variables: {
      id: bookId,
    },
  });

  useEffect(() => {
    if (data) {
      setBook(data.book);
    }
  }, [data]);

  return <BookDetails book={book} />;
};

export default BookPage;
