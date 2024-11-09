import React from "react";
import styled from "styled-components";
import GenerateImageForm from "./GenerateImageForm";
import GenerateImageCart from "./GenerateImageCart";

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  background: ${({ theme }) => theme.bg};
  padding: 30px 30px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  justify-content : center;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;



const Wrapper = styled.div`

  width : 100%;
  height: fit-content;
  max-width: 1200px;
  gap: 8%;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CreatePost = () => {
  return (
    <Container>
      <Wrapper>
        <GenerateImageForm />
        <GenerateImageCart loading/>
      </Wrapper>
    </Container>
  );
};

export default CreatePost;
