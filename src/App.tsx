import React, {useEffect, useState} from 'react';
import './App.css';
import {extractJwtPayload, jwtLocalStorageKey, JwtPayload} from "./utils/jwtUtils";
import Login from "./login/Login";
import Feed from "./feed/Feed";
import styled from "styled-components";

function App() {
  const [jwtExpired, setJwtExpired] = useState(true);

  const checkTokenExpiration = () => {
    const jwt = localStorage.getItem(jwtLocalStorageKey);
    if (jwt) {

      const decoded: JwtPayload = extractJwtPayload(jwt);
      const expiration = decoded.exp * 1000;

      if (Date.now() > expiration) {
        setJwtExpired(true);
      } else {
        setJwtExpired(false);
      }
    } else {
      setJwtExpired(true);
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  });

  return (
        <AppContainer>
          <Content>
            {
              jwtExpired ? (
                  <Login checkExpiration={checkTokenExpiration}/>
              ) : (
                  <Feed />
              )}
          </Content>
        </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export default App;
