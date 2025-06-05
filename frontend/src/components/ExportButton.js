import React from "react";

export default function ExportButton({ data }) {
  const exportCSV = () => {
    const csv = ["Title,Status"];
    data.forEach(task => {
      csv.push(`${task.title},${task.status}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
  };

  return (
    <button onClick={exportCSV} className="mb-4 bg-gray-700 text-white px-4 py-2 rounded">
      Export as CSV
    </button>
  );
}