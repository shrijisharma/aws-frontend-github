import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "username",
  });

  const [repositories, setRepositories] = useState([]);

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/userProfile/${userId}`
        );

        console.log("USER DETAILS:", response.data);

        setUserDetails(response.data);
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      }
    };

    const fetchRepositories = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/repo/user/${userId}`
        );

        console.log("PROFILE REPOSITORIES:", response.data);

        if (response.data.repositories) {
          setRepositories(response.data.repositories);
        } else {
          setRepositories([]);
        }
      } catch (err) {
        console.error("Cannot fetch repositories:", err);
        setRepositories([]);
      }
    };

    fetchUserDetails();
    fetchRepositories();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setCurrentUser(null);

    window.location.href = "/auth";
  };

  return (
    <>
      <Navbar />

      {/* Profile Navigation */}

      <UnderlineNav aria-label="Profile navigation">
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      {/* Profile + Contributions */}

      <div className="profile-page-wrapper">

        {/* Left Profile Section */}

        <div className="user-profile-section">

          <div className="profile-image">
            {userDetails.username?.charAt(0).toUpperCase()}
          </div>

          <div className="name">
            <h2>{userDetails.username}</h2>
          </div>

          <p className="profile-bio">
            GitHub Developer
          </p>

          <button className="follow-btn">
            Follow
          </button>

          <div className="follower">
            <p>
              <strong>10</strong> Followers
            </p>

            <p>
              <strong>3</strong> Following
            </p>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => alert("Edit profile feature coming soon")}
          >
            Edit Profile
          </button>

        </div>

        {/* Right Side */}

        <div className="profile-content">

          {/* Contributions */}

          <div className="heat-map-section">
            <h2>Recent Contributions</h2>

            <HeatMapProfile />
          </div>

          {/* Repositories */}

          <div className="profile-repositories">

            <div className="repositories-header">
              <h2>Repositories</h2>

              <Link to="/create">
                <button className="new-repo-btn">
                  + New
                </button>
              </Link>
            </div>

            {repositories.length === 0 ? (
              <p className="no-repositories">
                No repositories found.
              </p>
            ) : (
              <div className="profile-repo-list">

                {repositories.map((repo) => (
                  <div
                    className="profile-repo-card"
                    key={repo._id}
                  >
                    <Link to={`/repo/${repo._id}`}>
                      <h3>{repo.name}</h3>
                    </Link>

                    <p>
                      {repo.description ||
                        "No description provided."}
                    </p>

                    <span>
                      {repo.visibility
                        ? "Public"
                        : "Private"}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Logout */}

      <button
        onClick={logout}
        id="logout"
      >
        Logout
      </button>
    </>
  );
};

export default Profile;