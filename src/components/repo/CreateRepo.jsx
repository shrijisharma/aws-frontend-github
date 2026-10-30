import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createRepo.css";

const CreateRepository = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);

  const createRepository = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        "http://localhost:3000/repo/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            visibility,
            owner: userId,
          }),
        }
      );

      const data = await response.json();

      console.log("CREATED REPOSITORY:", data);

      if (!response.ok) {
        alert(data.error || "Repository creation failed");
        return;
      }

      alert("Repository created successfully!");

      navigate("/");
    } catch (err) {
      console.error("Error creating repository:", err);
    }
  };

  return (
    <div className="create-repository-page">
      <div className="create-repository-box">
        <h1>Create a Repository</h1>

        <input
          type="text"
          placeholder="Repository name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Repository description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={visibility}
            onChange={(e) => setVisibility(e.target.checked)}
          />

          Public Repository
        </label>

        <button onClick={createRepository}>
          Create Repository
        </button>
      </div>
    </div>
  );
};

export default CreateRepository;