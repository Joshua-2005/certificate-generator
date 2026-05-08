import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");

  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState("");

  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");

  const certificateId =
    "AMF-" + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/certificates"
      );

      const data = await response.json();

      setCertificates(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCertificates = certificates.filter((cert) =>
    cert.name.toLowerCase().includes(search.toLowerCase()) ||
    cert.certificateId
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const verifyCertificate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/certificate/${verifyId}`
      );

      const data = await response.json();

      if (data.success) {
        setVerifyResult("✅ Valid Certificate");
      } else {
        setVerifyResult("❌ Invalid Certificate");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = async () => {
    const certificateData = {
      name,
      role,
      event,
      date,
      certificateId,
    };

    try {
      await fetch("http://localhost:5000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificateData),
      });

      fetchCertificates();

      const input = document.getElementById("certificate");

      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "mm", "a4");

        pdf.addImage(imgData, "PNG", 10, 10, 277, 190);

        pdf.save("certificate.pdf");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #dbeafe, #fef3c7)",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        fontFamily: "Arial",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "60px",
          marginBottom: "30px",
          color: "#1e3a8a",
          fontWeight: "bold",
        }}
      >
        🎓 Certificate Generator
      </h1>

      {/* FORM */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          margin: "0 auto",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Enter Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Enter Event"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={downloadPDF}
          style={buttonStyle}
        >
          Download Certificate
        </button>
      </div>

      {/* VERIFY */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          margin: "30px auto",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2563eb",
          }}
        >
          Verify Certificate
        </h2>

        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={verifyId}
          onChange={(e) => setVerifyId(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={verifyCertificate}
          style={buttonStyle}
        >
          Verify
        </button>

        <h3
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          {verifyResult}
        </h3>
      </div>

      {/* DASHBOARD */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          width: "95%",
          margin: "30px auto",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          overflowX: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "20px",
          }}
        >
          📋 Saved Certificates
        </h2>

        <input
          type="text"
          placeholder="Search by Name or Certificate ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <table
          border="1"
          width="100%"
          cellPadding="15"
          style={{
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Event</th>
              <th>Date</th>
              <th>Certificate ID</th>
            </tr>
          </thead>

          <tbody>
            {filteredCertificates.map((cert, index) => (
              <tr key={index}>
                <td>{cert.name}</td>
                <td>{cert.role}</td>
                <td>{cert.event}</td>
                <td>{cert.date}</td>
                <td>{cert.certificateId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CERTIFICATE */}
      <div
        id="certificate"
        style={{
          backgroundColor: "white",
          width: "95%",
          maxWidth: "1200px",
          margin: "50px auto",
          padding: "60px",
          border: "15px solid #f59e0b",
          borderRadius: "25px",
          textAlign: "center",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "65px",
            color: "#1e3a8a",
          }}
        >
          Certificate of Completion
        </h1>

        <p style={{ fontSize: "30px", marginTop: "20px" }}>
          This certificate is proudly awarded to
        </p>

        <h2
          style={{
            fontSize: "60px",
            color: "#b45309",
            marginTop: "30px",
          }}
        >
          {name || "Your Name"}
        </h2>

        <p style={{ fontSize: "28px", marginTop: "30px" }}>
          For successfully working as
        </p>

        <h3
          style={{
            fontSize: "45px",
            color: "#2563eb",
            marginTop: "20px",
          }}
        >
          {role || "Role"}
        </h3>

        <p style={{ fontSize: "28px", marginTop: "30px" }}>
          In the event/internship:
        </p>

        <h3
          style={{
            fontSize: "42px",
            color: "#059669",
            marginTop: "20px",
          }}
        >
          {event || "Event Name"}
        </h3>

        <p style={{ fontSize: "24px", marginTop: "40px" }}>
          Date: {date || "DD/MM/YYYY"}
        </p>

        <p
          style={{
            fontSize: "20px",
            marginTop: "20px",
            color: "gray",
          }}
        >
          Certificate ID: {certificateId}
        </p>

        <div style={{ marginTop: "40px" }}>
          <QRCodeCanvas
            value={certificateId}
            size={120}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "100px",
          }}
        >
          <div>
            <hr style={{ width: "250px" }} />
            <p>Coordinator Signature</p>
          </div>

          <div>
            <hr style={{ width: "250px" }} />
            <p>Director Signature</p>
          </div>
        </div>

        <p
          style={{
            marginTop: "70px",
            fontSize: "24px",
            color: "#6b7280",
            fontWeight: "bold",
          }}
        >
          Amaanitvam Foundation
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid gray",
  fontSize: "18px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "20px",
  cursor: "pointer",
  marginTop: "10px",
  fontWeight: "bold",
};

export default App;