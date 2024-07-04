import React from "react";
import "./CRM.css";
import Navbar from "./Navbar";
import { Flex } from "@chakra-ui/react";

const CRM = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="black"
        justifyContent="center"
        alignItems="center"
      >
        <h1 style={{ textAlign: "center", fontWeight: "bold", color: "gray" }}>
          CRM
        </h1>
      </Flex>
      {/* Adauga aici componenta CRM */}
    </div>
  );
};

export default CRM;
