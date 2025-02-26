import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from '../Footer';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        city: '',
        bio: '',
        profileImageUrl: '',
        favoriteCards: [],  // New field
        readingPreferences: { preferredSpread: '', preferredQuestionType: '' },  // New field
        socialMediaHandles: { twitter: '', instagram: '' },  // New field
        bookmarks: [],  // New field
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // Fetch user data when the component loads
        const fetchProfileData = async () => {
            const userId = 'USER_ID';  // Replace with actual userId or get from context
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSaveProfile = async () => {
        try {
            const userId = 'USER_ID';  // Replace with actual userId
            const formData = new FormData();
            formData.append('username', profileData.username);
            formData.append('city', profileData.city);
            formData.append('bio', profileData.bio);

            // Append reading preferences
            formData.append('preferredSpread', profileData.readingPreferences.preferredSpread);
            formData.append('preferredQuestionType', profileData.readingPreferences.preferredQuestionType);

            // Append social media handles
            formData.append('twitter', profileData.socialMediaHandles.twitter);
            formData.append('instagram', profileData.socialMediaHandles.instagram);

            if (selectedImage) {
                formData.append('profileImage', selectedImage);  // Image upload
            }

            const response = await axios.put(`/api/users/update-profile/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfileData(response.data);  // Update local state with the new data
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <>
            <Navbar /> {/* Navbar at the top */}

            <div className="profile-page container">
                <div className="profile-header" style={{ paddingTop: '70px' }}>
                    <h2>Profile</h2>
                </div>

                <div className="profile-content">
                    <div className="profile-picture">
                        <img
                            src={profileData.profileImageUrl || 'https://via.placeholder.com/150'}
                            alt="Profile"
                            className="profile-image"
                        />
                        {editMode && (
                            <input type="file" name="profileImage" onChange={handleImageChange} />
                        )}
                    </div>

                    <div className="profile-details">
                        <div className="form-group">
                            <label>Username:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.username}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email (cannot be changed):</label>
                            <p>{profileData.email}</p>
                        </div>

                        <div className="form-group">
                            <label>City:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={profileData.city}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.city}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Bio:</label>
                            {editMode ? (
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.bio}</p>
                            )}
                        </div>

                        {/* Favorite Cards */}
                        <div className="form-group">
                            <label>Favorite Cards:</label>
                            <ul>
                                {profileData.favoriteCards.length ? (
                                    profileData.favoriteCards.map((card, idx) => (
                                        <li key={idx}>{card.name}</li>
                                    ))
                                ) : (
                                    <p>No favorite cards selected</p>
                                )}
                            </ul>
                        </div>

                        {/* Reading Preferences */}
                        <div className="form-group">
                            <label>Preferred Spread:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="preferredSpread"
                                    value={profileData.readingPreferences.preferredSpread}
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            readingPreferences: { ...prev.readingPreferences, preferredSpread: e.target.value },
                                        }))
                                    }
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.readingPreferences.preferredSpread || 'None'}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Preferred Question Type:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="preferredQuestionType"
                                    value={profileData.readingPreferences.preferredQuestionType}
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            readingPreferences: { ...prev.readingPreferences, preferredQuestionType: e.target.value },
                                        }))
                                    }
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.readingPreferences.preferredQuestionType || 'None'}</p>
                            )}
                        </div>

                        {/* Social Media Handles */}
                        <div className="form-group">
                            <label>Twitter Handle:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="twitter"
                                    value={profileData.socialMediaHandles.twitter}
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            socialMediaHandles: { ...prev.socialMediaHandles, twitter: e.target.value },
                                        }))
                                    }
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.socialMediaHandles.twitter || 'Not provided'}</p>
                            )}
                        </div>

                        <div className="form-group mb-5">
                            <label>Instagram Handle:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="instagram"
                                    value={profileData.socialMediaHandles.instagram}
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            socialMediaHandles: { ...prev.socialMediaHandles, instagram: e.target.value },
                                        }))
                                    }
                                    className="form-control"
                                />
                            ) : (
                                <p>{profileData.socialMediaHandles.instagram || 'Not provided'}</p>
                            )}
                        </div>

                        {editMode ? (
                            <button onClick={handleSaveProfile} className="btn btn-primary">
                                Save Changes
                            </button>
                        ) : (
                            <button onClick={() => setEditMode(true)} className="btn btn-secondary">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;
