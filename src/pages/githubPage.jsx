import { useState, useEffect } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Button,
  Modal,
  Paper,
} from "@mui/material";
import Table from "../components/Table";
import { githubAPI } from "../api/githubAPI";
import StarIcon from "@mui/icons-material/Star";

const GithubPage = () => {
  const [allRepos, setAllRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const itemsPerPage = 30;
  const maxDescriptionLength = 100; // Maximum characters for description preview

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const { items, totalCount } = await githubAPI(currentPage);
        setAllRepos(items);
        setTotalCount(Math.min(totalCount, 1000));
      } catch (error) {
        setError("Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenModal = (repo) => {
    setSelectedRepo(repo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRepo(null);
  };

  const columns = [
    {
      header: "Avatar",
      key: "avatar",
      render: (_, row) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={row.owner.avatar_url}
            alt="avatar"
            width={32}
            style={{ borderRadius: "50%" }}
          />
        </div>
      ),
    },
    {
      header: "Owner",
      key: "owner",
      render: (_, row) => <Box display="flex">{row.owner.login}</Box>,
    },
    {
      header: "Repository",
      key: "name",
      render: (value, row) => (
        <Box display="flex">
          <a href={row.html_url} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </Box>
      ),
    },
    {
      header: "Description",
      key: "description",
      render: (value, row) => {
        const isLongDescription = value && value.length > maxDescriptionLength;
        const shortDescription = value
          ? value.slice(0, maxDescriptionLength) +
            (isLongDescription ? "..." : "")
          : "No description";
        return (
          <Box display="flex" alignItems="center">
            <span>{shortDescription}</span>
            {isLongDescription && (
              <Button
                size="small"
                onClick={() => handleOpenModal(row)}
                sx={{ ml: 1, textTransform: "none" }}
              >
                View More
              </Button>
            )}
          </Box>
        );
      },
    },
    {
      header: "Stars",
      key: "stargazers_count",
      render: (value) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={0.5}
        >
          <StarIcon fontSize="small" sx={{ color: "#fbc02d" }} />
          {value}
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: { xs: 2, sm: 10 },
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Most Starred GitHub Repositories (Last 10 Days)
      </Typography>

      {error && (
        <Typography color="error" align="center" mb={2}>
          {error}
        </Typography>
      )}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        width="100%"
      >
        {loading ? (
          <CircularProgress size={48} />
        ) : (
          <Table columns={columns} data={allRepos} />
        )}
      </Box>

      {!loading && !error && allRepos.length === 0 && (
        <Typography align="center" mt={2}>
          No repositories found for the last 10 days.
        </Typography>
      )}

      {allRepos.length > 0 && (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          mt={3}
        >
          <Grid item xs={6} sm={6}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography>
              Page {currentPage} of {totalPages}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </Grid>
        </Grid>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            maxHeight: "80vh",
            overflow: "auto",
            p: 3,
            bgcolor: "background.paper",
          }}
        >
          {selectedRepo && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRepo.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Owner: {selectedRepo.owner.login}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Description: {selectedRepo.description || "No description"}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                <StarIcon fontSize="small" sx={{ color: "#fbc02d" }} />
                <Typography>{selectedRepo.stargazers_count} Stars</Typography>
              </Box>
              <Button
                variant="contained"
                href={selectedRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 1 }}
              >
                Visit Repository
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Close
              </Button>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default GithubPage;
