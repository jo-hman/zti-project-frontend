import styled from "styled-components";

const logOutHandler = () => {
    localStorage.clear();
    window.location.reload();
};

const Header = () => {
    return (
        <HeaderContainer>
            <StyledButton onClick={logOutHandler}>Logout</StyledButton>
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  text-align: center;
  flex-shrink: 0;
`;

const StyledButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: white;
  color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default Header;