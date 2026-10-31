import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
const BASE_URL=import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepos, setSuggestedRepos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/repo/user/${userId}`
        );

        const data = await response.json();

        console.log("USER REPO RESPONSE:", data);

        if (data.repositories) {
          setRepositories(data.repositories);
        } else {
          setRepositories([]);
        }
      } catch (err) {
        console.error(
          "Error while fetching repositories:",
          err
        );
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/repo/all`
        );

        const data = await response.json();

        console.log("ALL REPO RESPONSE:", data);

        setSuggestedRepos(data);
      } catch (err) {
        console.error(
          "Error while fetching repositories:",
          err
        );
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  // Search
  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      console.log("filtered", filteredRepo);

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />

      <section id="dashboard">

        {/* Suggested Repositories */}
        <aside>
          <h3>Suggested Repositories</h3>

          {suggestedRepos.map((repo) => {
            return (
              <div
                className="suggested-repo"
                key={repo._id}
              >
                <Link to={`/repo/${repo._id}`}>
                  <h4>{repo.name}</h4>
                </Link>

                <p>{repo.description}</p>
              </div>
            );
          })}
        </aside>

        {/* Your Repositories */}
        <main>
          <h2>Your Repositories</h2>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>

          {searchResults.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            searchResults.map((repo) => {
              return (
                <div
                  className="repository-card"
                  key={repo._id}
                >
                  <Link to={`/repo/${repo._id}`}>
                    <h4>{repo.name}</h4>
                  </Link>

                  <p>{repo.description}</p>
                </div>
              );
            })
          )}
        </main>

        {/* Upcoming Events */}
        <aside>
          <h3>Upcoming Events</h3>

          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>

            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>

            <li>
              <p>React Summit - Jan 10</p>
            </li>
          </ul>
        </aside>

      </section>
    </>
  );
};

export default Dashboard;