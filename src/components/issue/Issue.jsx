import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./issue.css";
const BASE_URL=import.meta.env.VITE_API_URL;

const Issue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  const fetchIssue = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/issue/${id}`
      );

      const data = await response.json();

      console.log("ISSUE:", data);

      setIssue(data.issue);

      setTitle(data.issue.title);
      setDescription(data.issue.description || "");
      setStatus(data.issue.status);
    } catch (err) {
      console.error("Error while fetching issue:", err);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const updateIssue = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/issue/updated/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            status,
          }),
        }
      );

      const data = await response.json();

      console.log("UPDATED ISSUE:", data);

      setIssue(data);

      alert("Issue updated successfully!");
    } catch (err) {
      console.error("Error while updating issue:", err);
    }
  };

  const deleteIssue = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/issue/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log("DELETED ISSUE:", data);

      alert("Issue deleted successfully!");

      navigate(-1);
    } catch (err) {
      console.error("Error while deleting issue:", err);
    }
  };

  if (!issue) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="issue-page">

      <h1>Issue Details</h1>

      <div className="issue-form">

        <input
          className="issue-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="issue-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="issue-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <div className="issue-buttons">

          <button
            className="update-button"
            onClick={updateIssue}
          >
            Update Issue
          </button>

          <button
            className="delete-button"
            onClick={deleteIssue}
          >
            Delete Issue
          </button>

        </div>

      </div>

    </div>
  );
};

export default Issue;