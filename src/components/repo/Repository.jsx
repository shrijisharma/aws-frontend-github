// const Repository = () => {
//   return (
//     <div>
//       <h1>Repository Details</h1>
//     </div>
//   );
// };

// export default Repository;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./repository.css";
const BASE_URL=import.meta.env.VITE_API_URL;

const Repository = () => {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [isStarred, setIsStarred] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchRepository = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/repo/${id}`
      );

      const data = await response.json();

      console.log("REPOSITORY:", data);

      setRepository(data);
    } catch (err) {
      console.error("Error while fetching repository:", err);
    }
  };
const checkStarred = async () => {
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch(
      `${BASE_URL}/star/check/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );

    const data = await response.json();

    setIsStarred(data.isStarred);
  } catch (err) {
    console.error("Error while checking star:", err);
  }
};
  useEffect(() => {
    fetchRepository();
    checkStarred();

  }, [id]);

  const createIssue = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/issue/create/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const data = await response.json();

      console.log("CREATED ISSUE:", data);

      setTitle("");
      setDescription("");

      fetchRepository();
    } catch (err) {
      console.error("Error while creating issue:", err);
    }
  };
const toggleStar = async () => {
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch(
      `${BASE_URL}/${
        isStarred ? "unstar" : "star"
      }/${id}`,
      {
        method: isStarred ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    setIsStarred(!isStarred);
  } catch (err) {
    console.error("Error while changing star:", err);
  }
};


  if (!repository) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="repository-page">

      {/* Repository Header */}
      <div className="repository-header">
        <h1>{repository.name}</h1>

  <button onClick={toggleStar}>
    {isStarred ? "★ Unstar" : "☆ Star"}
  </button>

        <p className="repository-description">
          {repository.description}
        </p>

        <div className="repository-info">
          <p>
            <strong>Owner:</strong>{" "}
            {repository.owner?.username}
          </p>

          <p>
            <strong>Visibility:</strong>{" "}
            {repository.visibility ? "Public" : "Private"}
          </p>
        </div>
      </div>

      {/* Create Issue */}
      <div className="create-issue">
        <h2>Create Issue</h2>

        <input
          className="issue-input"
          type="text"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="issue-textarea"
          placeholder="Issue description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={createIssue}>
          Create Issue
        </button>
      </div>

      {/* Issues */}
      <div className="issues-section">
        <h2>Issues</h2>

        {repository.issues?.length === 0 ? (
          <p>No issues found</p>
        ) : (
          repository.issues?.map((issue) => (
            <div className="issue-card" key={issue._id}>

              <Link to={`/issue/${issue._id}`}>
                <h3>{issue.title}</h3>
              </Link>

              <p>{issue.description}</p>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Repository;