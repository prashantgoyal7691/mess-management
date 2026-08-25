import { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useSystemStore } from "../../stores/systemStore";
import { useComplaintStore } from "../../stores/complaintStore"

export default function Complaints() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Food Quality");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.studentToken);
  const date = useSystemStore((state) => state.today);

  const submitComplaint = useComplaintStore(
    (state) => state.submitComplaint
  );

  const submitting = useComplaintStore(
    (state) => state.submitting
  );

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      await submitComplaint(token, {
        category: type,
        title,
        description,
        date,
      });

      alert("Complaint submitted!");

      setType("Food Quality");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
      alert(err.message || "Error submitting complaint");
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6">
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
          <h1 className="text-xl md:text-3xl font-bold">Complaints</h1>
          <p className="text-gray-500">
            Report issues related to mess services
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4 md:space-y-5 border">
          {/* Complaint Type */}
          <div>
            <p className="font-medium mb-2">Complaint Type</p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-lg p-2 md:p-3 text-sm md:text-base focus:outline-none focus:border-red-500"
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
              readOnly
              className="w-full border rounded-lg p-2 md:p-3 text-sm md:text-base focus:outline-none focus:border-red-500"
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
              className="w-full border rounded-lg p-2 md:p-3 text-sm md:text-base focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <p className="font-medium mb-2">Description</p>
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 md:p-3 text-sm md:text-base focus:outline-none focus:border-red-500"
              rows="4"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-medium ${submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}
