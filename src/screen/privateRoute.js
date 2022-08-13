import React from "react";
import { Route, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";

function PrivateRoute({ component: Component, scopes, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const token = localStorage.getItem("token");
        if (token) {
          const { exp } = jwt.decode(token);
          if (Date.now() >= exp * 1000) {
            return <Redirect to="/login" />;
          } else {
            return <Component {...props} />;
          }
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
}
export default PrivateRoute;
