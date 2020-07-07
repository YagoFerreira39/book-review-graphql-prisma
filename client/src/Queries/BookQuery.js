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

export { BOOK_QUERY as default };
