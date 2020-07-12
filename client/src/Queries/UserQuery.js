import gql from "graphql-tag";

const USERS_QUERY = gql`
  {
    users {
      id
      name
      email
      imageFile
      wantToRead {
        id
        title
        genre
        imageFile
        author {
          id
          name
        }
      }
      currentRead {
        id
        title
        genre
        imageFile
        author {
          id
          name
        }
      }
      completeRead {
        id
        title
        genre
        imageFile
        author {
          id
          name
        }
      }
      groups {
        id
        name
      }
      reviews {
        id
        text
        book {
          id
          title
        }
      }
    }
  }
`;

export { USERS_QUERY as default };
