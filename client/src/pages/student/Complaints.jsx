import { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { useNavigate } from "react-router-dom";

const getISTDate = (date = new Date()) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toLocaleDateString("en-CA");
};

export default function Complaints() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Food Quality");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getISTDate());
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("studentToken");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaint/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: type,
          title,
          description,
          date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Complaint submitted!");

      // Reset form
      setType("Food Quality");
      setTitle("");
      setDescription("");
      setDate(getISTDate());
    } catch (err) {
      console.log(err);
      alert("Error submitting complaint");
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/student/my-complaints")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
          >
            View My Complaints →
          </button>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">🚨 Complaints</h1>
          <p className="text-gray-500">
            Report issues related to mess services
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-5 border">
          {/* Complaint Type */}
          <div>
            <p className="font-medium mb-2">Complaint Type</p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-red-500"
            >
              <option>Food Quality</option>
              <option>Mess Staff</option>
              <option>Hygiene</option>
              <option>Service Delay</option>
              <option>Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <p className="font-medium mb-2">Date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Title */}
          <div>
            <p className="font-medium mb-2">Title</p>
            <input
              type="text"
              placeholder="Enter complaint title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <p className="font-medium mb-2">Description</p>
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-red-500"
              rows="4"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-medium"
          >
            Submit Complaint
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}
