//src/pages/ProfilePage.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://e-commerce-hfbs.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      const addressParts = data.user.address
        ?.split(",")
        .map((part: string) => part.trim()) || ["", "", ""];
      setProfile({
        ...data.user,
        address: addressParts[0] || "",
        city: addressParts[1] || "",
        country: addressParts[2] || "",
      });
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const profileToSend = {
        fullName: editedProfile.fullName,
        email: editedProfile.email,
        phone: editedProfile.phone,

        address:
          `${editedProfile.address}, ${editedProfile.city}, ${editedProfile.country}`.trim(),
      };

      const response = await fetch(
        "https://e-commerce-hfbs.onrender.com/api/users/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileToSend), 
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // Split the address back into components when setting the profile
      const addressParts = data.user.address
        ?.split(",")
        .map((part: string) => part.trim()) || ["", "", ""];
      setProfile({
        ...data.user,
        address: addressParts[0] || "",
        city: addressParts[1] || "",
        country: addressParts[2] || "",
      });

      setIsEditing(false);
      setEditedProfile(null);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Profile
          </Typography>
          {!isEditing ? (
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={handleEditClick}
              sx={{ textTransform: "none" }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box>
              <IconButton color="primary" onClick={handleSaveProfile}>
                <SaveIcon />
              </IconButton>
              <IconButton color="error" onClick={handleCancelEdit}>
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
              mr: 3,
            }}
          >
            {profile.fullName?.[0]?.toUpperCase() || (
              <PersonIcon fontSize="large" />
            )}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="500">
              {profile.fullName}
            </Typography>
            <Typography color="text.secondary">{profile.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={isEditing ? editedProfile?.fullName : profile.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={isEditing ? editedProfile?.email : profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={isEditing ? editedProfile?.phone : profile.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={isEditing ? editedProfile?.address : profile.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={isEditing ? editedProfile?.city : profile.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={isEditing ? editedProfile?.country : profile.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              sx={{ mb: 3 }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
