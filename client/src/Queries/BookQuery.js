import gql from "graphql-tag";

const BOOK_QUERY = gql`
  {
    books {
      id
      title
      sinopse
      imageFile
      published
      genre
      pages
      author {
        id
        name
      }
    }
  }
`;

const SINGLE_BOOK_QUERY = gql`
  query book($id: ID!) {
    book(id: $id) {
      id
      title
      sinopse
      imageFile
      published
      genre
      pages
      author {
        id
        name
      }
    }
  }
`;

export { BOOK_QUERY, SINGLE_BOOK_QUERY };
