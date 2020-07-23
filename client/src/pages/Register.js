import React, { useState, useContext, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Form, Button, Grid, Icon } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";
import uploadFile from "../utils/uploadFile";
import { Image, Transformation } from "cloudinary-react";
import "./pages.style.css";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(createUser, {
    username: "",
    email: "",
    password: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const onDrop = useCallback(async (file) => {
    const data = await uploadFile(file);
    console.log("CLOUDFILE", data);
    if (data.secure_url) {
      values["imageFile"] = data.secure_url;
      setImage(`${data.public_id}`);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [addUser, { error }] = useMutation(REGISTER_USER, {
    update(
      _,
      {
        data: { createUser: userData },
      }
    ) {
      console.log(userData);
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err);
      //setErrors(err.graphQLErrors[0].message);
    },
    variables: values,
  });

  function createUser() {
    addUser();
  }

  function displayPic() {
    if (image) {
      return (
        <Image
          className="signup-pic"
          publicId={`${image}`}
          cloud_name={process.env.CLOUD_NAME}
          secure="true"
        >
          <Transformation
            width="400"
            height="400"
            gravity="face"
            radius="max"
            crop="crop"
          />
          <Transformation width="200" crop="scale" />
        </Image>
      );
    }
  }

  function uploadPic() {
    return (
      <div className="container">
        {displayPic()}
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag 'n' drop some files here</p>
          )}
          <button type="button">Open File Dialog</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Sign Up</h1>
        <div>
          <Form
            onSubmit={onSubmit}
            noValidate
            className={loading ? "loading" : "form-input"}
          >
            <Icon className="reg-icons" name="user" />
            <Form.Input
              className="reg-input"
              placeholder="Username"
              name="username"
              value={values.username}
              error={errors.username ? true : false}
              onChange={onChange}
            />
            <Icon className="reg-icons" name="at" />
            <Form.Input
              className="reg-input"
              placeholder="Email"
              name="email"
              value={values.email}
              error={errors.email ? true : false}
              onChange={onChange}
            />
            <Icon className="reg-icons" name="lock" />
            <Form.Input
              className="reg-input"
              placeholder="Password"
              name="password"
              value={values.password}
              error={errors.password ? true : false}
              onChange={onChange}
            />
            <Button id="signup-btn" type="submit" primary>
              Sign Up
            </Button>
          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                <li key={errors}>{errors}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const REGISTER_USER = gql`
  mutation createUser(
    $username: String!
    $email: String!
    $password: String!
    $imageFile: String
  ) {
    createUser(
      data: {
        name: $username
        email: $email
        password: $password
        imageFile: $imageFile
      }
    ) {
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

export default Register;
