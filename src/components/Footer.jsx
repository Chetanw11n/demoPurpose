import React from "react"
import { Container } from "react-bootstrap"

const Footer = () => {
  return (
    <footer
      style={{
        background: "#212529",
        color: "white",
        padding: "10px 0",
        textAlign: "center"
      }}
    >
      <Container fluid>
        © {new Date().getFullYear()} Transport Government System
      </Container>
    </footer>
  )
}

export default Footer