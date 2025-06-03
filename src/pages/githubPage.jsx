import { useState, useEffect } from "react";
import { CircularProgress, Box, Typography, Grid, Button } from "@mui/material";
import Table from "../components/Table";
import { githubAPI } from "../api/githubAPI";
import StarIcon from "@mui/icons-material/Star";

const GithubPage = () => {
  const [allRepos, setAllRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 30;

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
      render: (_, row) => (
        <Box display="flex" justifyContent="center">
          {row.owner.login}
        </Box>
      ),
    },
    {
      header: "Repository",
      key: "name",
      render: (value, row) => (
        <Box display="flex" justifyContent="center">
          <a href={row.html_url} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </Box>
      ),
    },
    {
      header: "Description",
      key: "description",
      render: (value) => {
        return value || "No description";
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
        maxWidth: "1000px",
        margin: "0 auto",
        padding: 2, // spacing = 16px (theme-based)
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
    </Box>
  );
};

export default GithubPage;
