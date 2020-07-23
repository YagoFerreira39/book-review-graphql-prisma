import React, { useState, useContext } from "react";
import { Form, Button, Grid, Icon } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useMutation, UseQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";

import "./pages.style.css";

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
    <div className="container">
      <div className="login-container">
        <h1>Sign In</h1>
        <Form className="form-input" onSubmit={onSubmit} noValidate>
          <Icon className="reg-icons" name="user" />
          <Form.Input
            className="reg-input"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={onChange}
          />

          <Icon className="reg-icons" name="lock" />
          <Form.Input
            className="reg-input"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={onChange}
          />

          <Button id="signup-btn" primary type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      user {
        id
        name
        email
        imageFile
      }
      token
    }
  }
`;

export default Login;
