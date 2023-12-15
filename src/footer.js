const Footer = () => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        cursor: "pointer",
        position: "fixed",
        bottom: "0",
        width: "100%",
        backgroundColor: "#f1f1f1",
        padding: "10px",
      }}
      onClick={() => window.open("https://github.com/papadonut9", "_blank")}
    >
      v0.5.2 Made with ❤️ by PapaDonut9
    </div>
  );
};

export default Footer;
