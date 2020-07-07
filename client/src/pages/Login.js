import React, { useState, useContext } from "react";
import { Form, Button, Grid, Icon } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";

function Login(props) {
  const context = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(loginUserCB, {
    email: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(
      proxy,
      {
        data: { login: userData },
      }
    ) {
      console.log("RED", userData);
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err);
    },
    variables: values,
  });

  function loginUserCB() {
    loginUser();
  }

  return (
    <Grid>
      <Grid.Column width={8} />
      <Grid.Column width={8}>
        <h1>Sign In</h1>
        <Form onSubmit={onSubmit} noValidate>
          <Form.Field>
            <Icon name="user circle" />
            <Form.Input
              label="Email"
              placeholder="Email"
              name="email"
              width={10}
              value={values.email}
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field>
            <Icon name="lock" />
            <Form.Input
              label="Password"
              placeholder="Password"
              name="password"
              width={10}
              value={values.password}
              onChange={onChange}
            />
          </Form.Field>
          <Button primary type="submit">
            Submit
          </Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export default Login;
