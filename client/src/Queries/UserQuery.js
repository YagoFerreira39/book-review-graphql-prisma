import gql from "graphql-tag";

const USERS_QUERY = gql`
  {
    users {
      id
      name
      email
      imageFile
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
