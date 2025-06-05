import React, { useState } from "react";
import "./styles/FileUploader.css";

export default function FileUploader({ taskId }) {
  const [file, setFile] = useState(null);

  const uploadFile = () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:5000/api/tasks/${taskId}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => alert("✅ File uploaded successfully"));
  };

  return (
    <div className="file-upload-wrapper">
      <div className="file-input-wrapper">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />
      </div>
      <div className="upload-button-wrapper">
        <button onClick={uploadFile} className="upload-button">
          Upload
        </button>
      </div>
    </div>
  );
}
