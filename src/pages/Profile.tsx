import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import api from "../api";
import { logout } from "../redux/slices/authSlice"; // clear auth state
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(
    user?.profilePic || "http://localhost:5000/uploads/default-profile.png"
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInput = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setBio(user?.bio || "");
    setProfilePic(user?.profilePic || "http://localhost:5000/uploads/default-profile.png");
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
  setError("");
  setSuccess("");

  if (!token) {
    setError("You must be logged in to update your profile.");
    return;
  }

  try {
    setSaving(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("introduction", bio);
    if (selectedFile) formData.append("profilePic", selectedFile);

    const res = await api.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    setSuccess("Profile updated successfully!");
    setEditing(false);
    setSelectedFile(null);
    setProfilePic(res.data.user.profilePicture || profilePic);
  } catch (err: unknown) {
    // Type narrowing
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        handleLogout();
      } else if (err.response?.data && typeof err.response.data === "object") {
        const message = (err.response.data as { message?: string })?.message;
        setError(message || "Could not update profile. Please try again.");
      } else {
        setError("Could not update profile. Please try again.");
      }
    } else {
      setError("An unexpected error occurred.");
    }
  } finally {
    setSaving(false);
  }
};

  const handleLogout = () => {
    dispatch(logout()); // clear Redux auth state
    navigate("/"); // redirect to Welcome page
  };

  return (
    <div className="container center-page">
      <div className="form-card">
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Your Profile</h2>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <button
            onClick={() => fileInput.current?.click()}
            style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
            aria-label="Upload profile picture"
          >
            <img
              src={profilePic}
              alt={fullName ? `${fullName} profile picture` : "Profile"}
              className="profile-pic"
            />
          </button>
          <input
            type="file"
            ref={fileInput}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          disabled={!editing || saving}
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={!editing || saving}
        />

        <textarea
          maxLength={150}
          placeholder="Write a short bio..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={!editing || saving}
        />

        {error && <div className="ui-message error-message">{error}</div>}
        {success && <div className="ui-message success-message">{success}</div>}

        <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {!editing ? (
            <button onClick={() => setEditing(true)} disabled={saving}>
              Edit Profile
            </button>
          ) : (
            <button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          )}
          <button style={{ backgroundColor: "#e74c3c", color: "#fff" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}




