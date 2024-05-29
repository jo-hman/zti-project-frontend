import { useState } from "react";
import { usersUrl, authorizeUrl, defaultHeaders } from "../utils/feedApi";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import { jwtLocalStorageKey } from "../utils/jwtUtils";
import styled from "styled-components";

interface AccountRequest {
    email: string;
    password: string;
}

const Login: React.FC<{
    checkExpiration: () => void;
}> = ({ checkExpiration })=> {

    const [isError, setIsError] = useState(false);

    const accountRequestInitialValues: AccountRequest = {
        email: '',
        password: ''
    };

    const validation = Yup.object({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const registerHandler = (accountRequest: AccountRequest) => {
        fetch(usersUrl, {
            'method': 'POST',
            'body': JSON.stringify({
                email: accountRequest.email,
                password: accountRequest.password
            }),
            'headers': defaultHeaders,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then(response => localStorage.setItem(jwtLocalStorageKey, response.authToken))
            .then(() => checkExpiration())
            .catch(() => setIsError(true));
    };

    const loginHandler = (accountRequest: AccountRequest) => {
        fetch(authorizeUrl, {
            'method': 'POST',
            'body': JSON.stringify({
                email: accountRequest.email,
                password: accountRequest.password
            }),
            'headers': defaultHeaders
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then(response => localStorage.setItem(jwtLocalStorageKey, response.authToken))
            .then(() => checkExpiration())
            .catch(() => setIsError(true));
    };

    return (
        <Formik
            initialValues={accountRequestInitialValues}
            validationSchema={validation}
            onSubmit={loginHandler}
            initialErrors={{ email: 'Required', password: 'Required' }}
        >
            {({ isValid, values }) => (
                <StyledForm>
                    <FormGroup>
                        <StyledLabel htmlFor="email">Email/Username:</StyledLabel>
                        <StyledField type="text" id="email" name="email" />
                        <StyledErrorMessage name="email" component="div" />

                        <StyledLabel htmlFor="password">Password:</StyledLabel>
                        <StyledField type="password" id="password" name="password" />
                        <StyledErrorMessage name="password" component="div" />

                        <StyledButton type="submit" disabled={!isValid}>Login</StyledButton>
                        <StyledButton
                            type="button"
                            disabled={!isValid}
                            onClick={() => registerHandler(values)}
                        >
                            Register
                        </StyledButton>

                        {isError && (
                            <ErrorText>
                                You cannot log in, you have provided wrong credentials or you cannot register with an already existing account.
                            </ErrorText>
                        )}
                    </FormGroup>
                </StyledForm>
            )}
        </Formik>
    )
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  margin: 50px auto;
  background-color: #f9f9f9;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const StyledField = styled(Field)`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: red;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;

export default Login;