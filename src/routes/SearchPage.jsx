import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getStates, getUserInfo, getAlbumCoin, putInsertCoin, getCoinAndCoinCommWithDetail } from "../service/supabase";
import withProtected from "../hoc/withProtected";
import LoadingSpinner from "../info/LoadingSpinner";
import { values as coinageValues } from "../utils/constants";
import "../style/SearchPage.css";

function SearchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState(null);
  const [userCoins, setUserCoins] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCoinage, setSelectedCoinage] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [allAvailableYears, setAllAvailableYears] = useState([]);
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const [insertYear, setInsertYear] = useState("");
  const [inserting, setInserting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      setLoading(true);
      try {
        // Get states
        const statesJson = await getStates();
        if (!ignore) {
          setStates(statesJson);
        }

        // Get user info
        const userInfo = await getUserInfo();
        if (!ignore && userInfo?.id) {
          setUserId(userInfo.id);

          // Get user's album coins
          const coins = await getAlbumCoin(userInfo.id);
          if (!ignore) {
            setUserCoins(coins || []);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setTimeout(() => {
        setLoading(false);
      }, 700);
    }
    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (selectedCoinage && selectedState) {

      getCoinAndCoinCommWithDetail(selectedState).then((stateData) => {
        if (stateData && stateData.coin) {
          const yearsInData = Object.keys(stateData.coin).map((year) => parseInt(year));
          const minYear = Math.min(...yearsInData);
          const currentYear = new Date().getFullYear();
          
          const allYearsRange = [];
          for (let year = minYear; year <= currentYear; year++) {
            allYearsRange.push(year);
          }
          
          setAllAvailableYears(allYearsRange);
        }

        setHasSearched(true);
      });
    }
  }, [selectedCoinage, selectedState]);

  const handleSearch = () => {

    // Get all available years from the state's coin data
    getCoinAndCoinCommWithDetail(selectedState).then((stateData) => {
      if (stateData && stateData.coin) {
        // Extract minimum and maximum years from the coin object
        const yearsInData = Object.keys(stateData.coin).map((year) => parseInt(year));
        const minYear = Math.min(...yearsInData);
        const currentYear = new Date().getFullYear();
        
        // Create array of all years from first year to current year
        const allYearsRange = [];
        for (let year = minYear; year <= currentYear; year++) {
          allYearsRange.push(year);
        }
        
        setAllAvailableYears(allYearsRange);
      }

      setHasSearched(true);
    });
  };

  const handleReset = () => {
    setSelectedCoinage("");
    setSelectedState("");
    setHasSearched(false);
  };

  const handleCloseInsertDialog = () => {
    setOpenInsertDialog(false);
    setInsertYear("");
  };

  const handleInsertCoin = async () => {
    if (!insertYear || !selectedState || !selectedCoinage || !userId) {
      alert("Per favore compilare tutti i campi");
      return;
    }

    setInserting(true);
    try {
      const result = await putInsertCoin(selectedState, parseInt(insertYear), coinageValues[selectedCoinage], userId);
      
      if (result && result.data) {
        handleCloseInsertDialog();
        
        // Refresh the user coins list
        const updatedCoins = await getAlbumCoin(userId);
        setUserCoins(updatedCoins || []);
        
        // Re-run the search to show the newly added coin
        handleSearch();
      } else {
        alert("Errore nell'aggiunta della moneta");
      }
    } catch (error) {
      console.error("Error inserting coin:", error);
      alert("Errore nell'aggiunta della moneta");
    } finally {
      setInserting(false);
    }
  };

  const handleYearClick = (year) => {
    // Check if user already has this year
    const hasYear = userCoins.some(
      (coin) =>
        coin.state === selectedState &&
        coin.year === year &&
        coin.value === coinageValues[selectedCoinage]
    );

    if (!hasYear) {
      setInsertYear(year.toString());
      setOpenInsertDialog(true);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="search-page-container">
      <div className="search-page-header">
        <IconButton
          onClick={() => navigate("/albums")}
          sx={{ color: "#fff", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
        >
          <ArrowBackIcon sx={{ fontSize: "28px" }} />
        </IconButton>
        <h1>Cerca Moneta</h1>
      </div>

      <div className="search-page-content">
        {/* Search Form */}
        <div className="search-form-section">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Coinage Selection */}
            <Box>
              <Box sx={{ mb: 2, fontWeight: 700, fontSize: "1.1rem", color: "#202124" }}>
                Taglio
              </Box>
              <ToggleButtonGroup
                value={selectedCoinage}
                exclusive
                onChange={(e, newCoinage) => {
                  if (newCoinage !== null) {
                    setSelectedCoinage(newCoinage);
                  }
                }}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2.5,
                  justifyContent: "center",
                  "& .MuiToggleButton-root": {
                    border: "2px solid #dadce0",
                    borderRadius: "50%",
                    width: "90px",
                    height: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    textAlign: "center",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    backgroundColor: "#fff",
                    color: "#202124",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      borderColor: "#1F71D1",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#1F71D1",
                      color: "#fff",
                      borderColor: "#1F71D1",
                      boxShadow: "0 4px 12px rgba(31, 113, 209, 0.3)",
                    },
                    "@media (max-width: 768px)": {
                      width: "70px",
                      height: "70px",
                      fontSize: "0.75rem",
                    },
                  },
                }}
              >
                {Object.keys(coinageValues).map((coinageKey) => (
                  <ToggleButton key={coinageKey} value={coinageKey}>
                    <span style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                      {coinageKey}
                    </span>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {/* State Selection */}
            <Box>
              <Box sx={{ mb: 2, fontWeight: 700, fontSize: "1.1rem", color: "#202124" }}>
                Stato
              </Box>
              <ToggleButtonGroup
                value={selectedState}
                exclusive
                onChange={(e, newState) => {
                  if (newState !== null) {
                    setSelectedState(newState);
                  }
                }}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 1.2,
                  "& .MuiToggleButton-root": {
                    width: "100%",
                    height: "44px",
                    border: "2px solid #dadce0",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    minHeight: "44px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    backgroundColor: "#fff",
                    color: "#202124",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "normal",
                    lineHeight: 1.2,
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      borderColor: "#1F71D1",
                      boxShadow: "0 2px 8px rgba(31, 113, 209, 0.2)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#1F71D1",
                      color: "#fff",
                      borderColor: "#1F71D1",
                      boxShadow: "0 4px 12px rgba(31, 113, 209, 0.3)",
                    },
                  },
                }}
              >
                {states &&
                  Object.keys(states)
                    .sort((a, b) =>
                      states[a].state_name > states[b].state_name ? 1 : -1
                    )
                    .map((key) => (
                      <ToggleButton key={key} value={states[key].state_name}>
                        {states[key].state_name}
                      </ToggleButton>
                    ))}
              </ToggleButtonGroup>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                onClick={handleReset}
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: "#dadce0",
                  color: "#202124",
                  fontWeight: 600,
                  padding: "12px 24px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                    borderColor: "#1F71D1",
                    color: "#1F71D1",
                    fontSize: "1rem",
                    padding: "12px 24px",
                  },
                }}
              >
                Ripristina
              </Button>
            </Box>
          </Box>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="search-results-section">
            <h2>Risultati</h2>
            <Box sx={{ p: 3, backgroundColor: "#f8f9fa", borderRadius: "8px" }}>

              {allAvailableYears && allAvailableYears.length > 0 ? (
                <Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: 2,
                      "@media (max-width: 768px)": {
                         gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                      },
                    }}
                  >
                    {allAvailableYears.map((year, idx) => {
                      const userHasYear = userCoins.some(
                        (coin) =>
                          coin.state === selectedState &&
                          coin.year === year &&
                          coin.value === coinageValues[selectedCoinage]
                      );

                      return (
                        <Button
                          key={idx}
                          onClick={() => handleYearClick(year)}
                          disabled={userHasYear}
                          sx={{
                            p: 0,
                            width: "100px",
                            height: "100px",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            backgroundColor: userHasYear ? "#34A853" : "#fff",
                            color: userHasYear ? "#fff" : "#1F71D1",
                            border: userHasYear ? "2px solid #34A853" : "2px solid #dadce0",
                            borderRadius: "50%",
                            cursor: userHasYear ? "not-allowed" : "pointer",
                            opacity: userHasYear ? 1 : 1,
                            transition: "all 0.3s ease",
                            "&:hover": userHasYear
                              ? {}
                              : {
                                    backgroundColor: "#1F71D1",
                                    color: "#fff",
                                    borderColor: "#1F71D1",
                                    boxShadow: "0 4px 12px rgba(31, 113, 209, 0.3)",
                                    fontSize: "1.5rem",
                                },
                            "&:disabled": {
                              backgroundColor: "#34A853",
                              color: "#fff",
                              borderColor: "#34A853",
                            },
                            "@media (max-width: 768px)": {
                              width: "80px",
                              height: "80px",
                              fontSize: "1rem",
                            },
                          }}
                        >
                          {year}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <p>Nessun anno disponibile per la selezione effettuata.</p>
              )}
            </Box>
          </div>
        )}

        {/* Insert Coin Dialog */}
        <Dialog open={openInsertDialog} onClose={handleCloseInsertDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#202124" }}>Inserisci Moneta</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ backgroundColor: "#f8f9fa", p: 3, borderRadius: "8px", border: "1px solid #dadce0" }}>
                <div style={{ marginBottom: "12px" }}><strong style={{ color: "#202124" }}>Taglio:</strong> <span style={{ color: "#5f6368" }}>{selectedCoinage} - {coinageValues[selectedCoinage]}</span></div>
                <div style={{ marginBottom: "12px" }}><strong style={{ color: "#202124" }}>Stato:</strong> <span style={{ color: "#5f6368" }}>{selectedState}</span></div>
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #dadce0" }}>
                  <strong style={{ color: "#202124" }}>Anno:</strong> <span style={{ color: "#5f6368", marginLeft: "8px" }}>{insertYear}</span>
                </div>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleCloseInsertDialog} variant="outlined" sx={{ borderColor: "#dadce0", color: "#202124", textTransform: "none", fontWeight: 600 }}>Annulla</Button>
            <Button
              onClick={handleInsertCoin}
              variant="contained"
              disabled={!insertYear || inserting}
              sx={{
                backgroundColor: "#1F71D1",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#1565B8",
                  boxShadow: "0 4px 12px rgba(31, 113, 209, 0.3)",
                },
              }}
            >
              {inserting ? "Inserimento..." : "Inserisci"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default withProtected(SearchPage);
