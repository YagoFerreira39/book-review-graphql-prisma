import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../../context/auth";
import UserBooks from "./UserBooks";
import USERS_QUERY from "../../Queries/UserQuery";

const UserProfile = (props) => {
  const [userData, setUserData] = useState({});
  const { user } = useContext(AuthContext);

  const { loading, error, data, refetch } = useQuery(USERS_QUERY);

  useEffect(() => {
    if (data && user) {
      console.log(user);
      data.users.map((u) => {
        if (u.id === user.user.id) {
          setUserData(u);
        }
      });
    }
  }, [data]);

  return (
    <UserBooks
      wantToRead={userData.wantToRead}
      currentRead={userData.currentRead}
      completeRead={userData.completeRead}
      loading={loading}
      error={error}
    />
  );
};

export default UserProfile;
