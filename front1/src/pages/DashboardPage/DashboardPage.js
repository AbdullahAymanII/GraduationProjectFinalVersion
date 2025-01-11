import React, {useState, useEffect} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Avatar,
} from '@mui/material';
import {
    UploadFile,
    Dashboard as DashboardIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import {Bar, Line, Pie, HorizontalBar} from 'react-chartjs-2';
import 'chart.js/auto';
import {useNavigate} from "react-router-dom";

const DashboardPage = () => {
    const [file, setFile] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [attacksLabel, setAttacksLabel] = useState(null);
    const [binaryPredictionLabel, setBinaryPredictionLabel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState({name: '', profileImage: ''});

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/info', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch user info');

            const userInfo = await response.json();
            setUser({name: userInfo.username, profileImage: userInfo.profileImage});

        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setPredictionResult(null); // Reset prediction result when a new file is uploaded
    };

    const mapPredictionsToLabels = (result) => {
        const {multiLabels, multi_predictions, binary_predictions, binaryLabels} = result;
        setDownloadLink(result.csv_file_url)
        console.log("-----------------------------------------------------");
        console.log("binaryLabels:", binaryLabels);
        console.log("-----------------------------------------------------");

        // Correctly access the MultiLabel object
        const multiLabelMapping = Object.entries(multiLabels.MultiLabel).reduce((acc, [key, value]) => {
            acc[value] = key; // Reverse key-value for direct mapping
            return acc;
        }, {});

        const binaryLabelMapping = Object.entries(binaryLabels.BinaryLabel).reduce((acc, [key, value]) => {
            acc[value] = key; // Reverse key-value for direct mapping
            return acc;
        }, {});

        setAttacksLabel(multiLabelMapping);

        console.log("-----------------------------------------------------");
        console.log("Reversed Label Mapping:", multiLabelMapping);
        console.log("-----------------------------------------------------");
        console.log("Reversed attack_results:", binaryLabelMapping);
        console.log("-----------------------------------------------------");
        // Map predictions to their labels
        const binaryMappedLabels = binary_predictions.map(prediction => {
            const label = binaryLabelMapping[prediction];
            if (label === undefined) {
                // console.warn(`Prediction value ${prediction} not found in labelMapping`);
                return "Infilteration"; // Default fallback
            }
            return label;
        });

        const multiMappedLabels = multi_predictions.map(prediction => {
            const label = multiLabelMapping[prediction];
            if (label === undefined) {
                // console.warn(`Prediction value ${prediction} not found in labelMapping`);
                return "Infilteration"; // Default fallback
            }
            return label;
        });
        setBinaryPredictionLabel(binaryMappedLabels);

        console.log("-----------------------------------------------------");
        console.log("-----------------------------------------------------");
        return multiMappedLabels;
    };

    const handlePrediction = async () => {
        if (!file) {
            alert("Please upload a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setIsLoading(true);
            setPredictionResult(null); // Clear previous prediction result
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Prediction failed.");
            }

            const result = await response.json();
            console.log(result);
            const mappedLabels = mapPredictionsToLabels(result);
            setPredictionResult(mappedLabels);
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const generateColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = Math.floor((i * 360) / count); // Distributes hues evenly across the spectrum
            colors.push(`hsl(${hue}, 70%, 50%)`); // HSL for vibrant colors
        }
        return colors;
    };

    const renderPredictionResults = () => {
        if (!predictionResult) {
            return <Typography>No predictions yet!</Typography>;
        }

        // Benign vs. Attack Distribution
        const benignAttackCounts = {
            Benign: binaryPredictionLabel.filter((label) => label === "Benign").length,
            Attack: binaryPredictionLabel.filter((label) => label === "Attack").length,
        };

        const benignAttackLabels = Object.keys(benignAttackCounts);
        const benignAttackData = Object.values(benignAttackCounts);

        const benignAttackColors = ["#4CAF50", "#F44336"]; // Green for Benign, Red for Attack

        // Attack Details Distribution
        const attackCounts = {};
        predictionResult.forEach((attack) => {
            attackCounts[attack] = (attackCounts[attack] || 0) + 1;
        });

        const attackLabels = Object.keys(attackCounts);
        const attackData = Object.values(attackCounts);

        const attackColors = generateColors(attackLabels.length);

        return (
            <Box>
                {/* Benign vs. Attack Distribution Pie Chart */}
                <Box sx={{marginBottom: 4}}>
                    <Typography variant="h6" align="center">Benign vs. Attack Distribution</Typography>
                    <Pie
                        data={{
                            labels: benignAttackLabels,
                            datasets: [
                                {
                                    data: benignAttackData,
                                    backgroundColor: benignAttackColors,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {display: true},
                                title: {display: true, text: "Benign vs. Attack Proportion"},
                            },
                        }}
                    />
                </Box>

                {/* Attack Distribution Bar Chart */}
                <Box sx={{marginBottom: 4}}>
                    <Typography variant="h6" align="center">Attack Distribution</Typography>
                    <Bar
                        data={{
                            labels: attackLabels,
                            datasets: [
                                {
                                    label: "Number of Occurrences",
                                    data: attackData,
                                    backgroundColor: attackColors.slice(0, attackLabels.length),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {display: true},
                                title: {display: true, text: "Distribution of Detected Attacks"},
                            },
                        }}
                    />
                </Box>

                {/* Attack Rankings (Horizontal Bar Chart) */}
                <Box sx={{marginBottom: 4}}>
                    <Typography variant="h6" align="center">Attack Rankings</Typography>
                    <Bar
                        data={{
                            labels: attackLabels,
                            datasets: [
                                {
                                    label: "Attack Frequency",
                                    data: attackData,
                                    backgroundColor: attackColors,
                                },
                            ],
                        }}
                        options={{
                            indexAxis: "y", // Makes the bar chart horizontal
                            responsive: true,
                            plugins: {
                                legend: {display: true},
                                title: {display: true, text: "Ranking of Attacks by Frequency"},
                            },
                        }}
                    />
                </Box>

                {/* Attack Proportion Pie Chart */}
                <Box>
                    <Typography variant="h6" align="center">Attack Proportions</Typography>
                    <Pie
                        data={{
                            labels: attackLabels,
                            datasets: [
                                {
                                    data: attackData,
                                    backgroundColor: attackColors.slice(0, attackLabels.length),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {display: true},
                                title: {display: true, text: "Proportion of Detected Attacks"},
                            },
                        }}
                    />
                </Box>
            </Box>
        );
    };


    return (
        <Box sx={{display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 260,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: 260,
                        boxSizing: 'border-box',
                        backgroundColor: '#1e293b',
                        color: '#ffffff'
                    },
                }}
            >
                <Typography variant="h5" sx={{textAlign: 'center', padding: 2, backgroundColor: '#0f172a'}}>
                    IDS Dashboard
                </Typography>
                <List>
                    {[{text: "Dashboard", icon: <DashboardIcon/>},
                        {text: "Analytics", icon: <AnalyticsIcon/>},
                        {text: "Settings", icon: <SettingsIcon/>}]
                        .map(({text, icon}) => (
                            <ListItem button key={text}>
                                <ListItemIcon sx={{color: '#ffffff'}}>{icon}</ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItem>
                        ))}
                </List>
            </Drawer>

            <Box sx={{flexGrow: 1, padding: 4}}>
                <AppBar position="static" sx={{background: '#334155', borderRadius: 2, marginBottom: 2}}>
                    <Toolbar>
                        <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                            <Avatar alt={user.name} src={user.profileImage} sx={{marginRight: 1}}/>
                            <Typography variant="h6">
                                {user.name}
                            </Typography>
                        </Box>
                        <Button
                            color="inherit"
                            onClick={() => {
                                navigate("/LoginForm")
                            }}
                            sx={{backgroundColor: '#f44336', width: '10%'}}
                        >
                            Log Out
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Upload File for Prediction</Typography>
                                    <Box display="flex" alignItems="center" marginBottom={2}>

                                        {file && (
                                            <Typography
                                                variant="body1"
                                                sx={{color: "green", fontWeight: "bold"}}
                                            >
                                                File Uploaded ✓
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    sx={{marginRight: 2}}
                                                    fullWidth
                                                    onClick={() => setFile(null)}
                                                >
                                                    Reset
                                                </Button>
                                            </Typography>
                                        )}

                                        {!file && (
                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{marginRight: 2}}
                                                fullWidth
                                            >
                                                Upload File
                                                <input type="file" hidden onChange={handleFileChange}/>
                                            </Button>
                                        )}

                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={handlePrediction}
                                        disabled={isLoading || !file}
                                        fullWidth
                                        sx={{
                                            backgroundColor: predictionResult ? "green" : undefined,
                                            "&:hover": {
                                                backgroundColor: predictionResult ? "darkgreen" : undefined,
                                            },
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} sx={{color: "white"}}/>
                                        ) : predictionResult ? (
                                            "Prediction Ready ✓"
                                        ) : (
                                            "Predict"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/*{predictionResult && (*/}
                        {/*    <Grid item xs={12} md={6}>*/}
                        {/*        <Card>*/}
                        {/*            <CardContent>*/}
                        {/*                <Typography variant="h6" gutterBottom>Download Predictions</Typography>*/}
                        {/*                <Button*/}
                        {/*                    variant="contained"*/}
                        {/*                    fullWidth*/}
                        {/*                    onClick={() => {*/}
                        {/*                        // Convert predictionResult to CSV format*/}
                        {/*                        const csvRows = [];*/}
                        {/*                        const headers = ["Index", "Prediction"];*/}
                        {/*                        csvRows.push(headers.join(",")); // Add headers*/}

                        {/*                        predictionResult.forEach((prediction, index) => {*/}
                        {/*                            csvRows.push(`${index},${prediction}`); // Add data rows*/}
                        {/*                        });*/}

                        {/*                        const csvContent = csvRows.join("\n");*/}
                        {/*                        const blob = new Blob([csvContent], { type: "text/csv" });*/}
                        {/*                        const url = URL.createObjectURL(blob);*/}
                        {/*                        const link = document.createElement("a");*/}
                        {/*                        link.href = url;*/}
                        {/*                        link.download = "prediction_results.csv";*/}
                        {/*                        document.body.appendChild(link);*/}
                        {/*                        link.click();*/}
                        {/*                        document.body.removeChild(link);*/}
                        {/*                    }}*/}
                        {/*                >*/}
                        {/*                    Download Results*/}
                        {/*                </Button>*/}
                        {/*            </CardContent>*/}
                        {/*        </Card>*/}
                        {/*    </Grid>*/}
                        {/*)}*/}

                        {predictionResult && (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Download Predictions
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => {
                                                // Convert predictionResult to CSV format
                                                const csvRows = [];
                                                const headers = ["Index", "Prediction"];
                                                csvRows.push(headers.join(",")); // Add headers

                                                predictionResult.forEach((prediction, index) => {
                                                    csvRows.push(`${index},${prediction}`); // Add data rows
                                                });

                                                const csvContent = csvRows.join("\n");
                                                const blob = new Blob([csvContent], {type: "text/csv"});
                                                const url = URL.createObjectURL(blob);
                                                const link = document.createElement("a");
                                                link.href = url;
                                                link.download = "prediction_results.csv";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            Download Results
                                        </Button>

                                        {/* New Block */}
                                        <div style={{marginTop: "16px"}}>
                                            <Typography variant="h6" gutterBottom>
                                                Additional Actions
                                            </Typography>
                                            {downloadLink && (
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    style={{marginTop: "8px"}}
                                                    onClick={() => {
                                                        const link = document.createElement("a");
                                                        link.href = downloadLink;
                                                        link.download = "labeled_dataset.csv";
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                >
                                                    Download Labeled Dataset
                                                </Button>
                                            )}
                                        </div>

                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Prediction Results</Typography>
                                    {renderPredictionResults()}
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default DashboardPage;


