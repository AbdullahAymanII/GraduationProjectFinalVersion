// import React, { useState } from 'react';
// import {
//     AppBar,
//     Toolbar,
//     Typography,
//     Button,
//     Box,
//     Drawer,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Container,
//     Grid,
//     Paper,
//     Divider,
//     CircularProgress,
//     Card,
//     CardContent,
// } from '@mui/material';
// import {
//     UploadFile,
//     Dashboard as DashboardIcon,
//     Analytics as AnalyticsIcon,
//     Settings as SettingsIcon,
// } from '@mui/icons-material';
// import { Pie, Bar, Line } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { useNavigate } from "react-router-dom";
//
// const DashboardPage = () => {
//     const [file, setFile] = useState(null);
//     const [predictionResult, setPredictionResult] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [predictionType, setPredictionType] = useState("binary");
//     const navigate = useNavigate();
//
//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//     };
//
//     const handlePrediction = async () => {
//         if (!file) {
//             alert("Please upload a file before submitting.");
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("predictionType", predictionType);
//
//         try {
//             setIsLoading(true);
//             const response = await fetch("http://localhost:5000/predict", {
//                 method: "POST",
//                 body: formData,
//             });
//
//             if (!response.ok) {
//                 const errorResponse = await response.json();
//                 throw new Error(errorResponse.error || "Prediction failed.");
//             }
//
//             const result = await response.json();
//             setPredictionResult(result.predictions);
//         } catch (error) {
//             alert(`An error occurred: ${error.message}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const togglePredictionType = () => {
//         setPredictionType((prev) => (prev === "binary" ? "multi" : "binary"));
//     };
//
//     const chartData = {
//         labels: [...new Set(predictionResult)],
//         datasets: [
//             {
//                 label: "Predictions Count",
//                 data: Object.values(
//                     predictionResult.reduce((acc, val) => {
//                         acc[val] = (acc[val] || 0) + 1;
//                         return acc;
//                     }, {})
//                 ),
//                 backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'],
//             },
//         ],
//     };
//
//     return (
//         <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
//             <Drawer
//                 variant="permanent"
//                 sx={{
//                     width: 260,
//                     flexShrink: 0,
//                     [`& .MuiDrawer-paper`]: { width: 260, boxSizing: 'border-box', backgroundColor: '#1e293b', color: '#ffffff' },
//                 }}
//             >
//                 <Typography variant="h5" sx={{ textAlign: 'center', padding: 2, backgroundColor: '#0f172a' }}>
//                     IoMT Dashboard
//                 </Typography>
//                 <Divider />
//                 <List>
//                     {[{ text: "Dashboard", icon: <DashboardIcon /> },
//                         { text: "Analytics", icon: <AnalyticsIcon /> },
//                         { text: "Settings", icon: <SettingsIcon /> }]
//                         .map(({ text, icon }) => (
//                             <ListItem button key={text}>
//                                 <ListItemIcon sx={{ color: '#ffffff' }}>{icon}</ListItemIcon>
//                                 <ListItemText primary={text} />
//                             </ListItem>
//                         ))}
//                 </List>
//             </Drawer>
//
//             <Box sx={{ flexGrow: 1, padding: 4 }}>
//                 <AppBar position="static" sx={{ background: '#334155', borderRadius: 2, marginBottom: 2 }}>
//                     <Toolbar>
//                         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                             Modern Dashboard
//                         </Typography>
//                         <Button color="inherit" onClick={() => { navigate("/LoginForm") }}>
//                             Log Out
//                         </Button>
//                     </Toolbar>
//                 </AppBar>
//
//                 <Container>
//                     <Grid container spacing={4}>
//                         <Grid item xs={12} md={6}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Upload File for Prediction</Typography>
//                                     <Button
//                                         variant="contained"
//                                         component="label"
//                                         sx={{ marginBottom: 2 }}
//                                     >
//                                         Upload File
//                                         <input type="file" hidden onChange={handleFileChange} />
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         onClick={handlePrediction}
//                                         disabled={isLoading}
//                                         fullWidth
//                                     >
//                                         {isLoading ? <CircularProgress size={24} /> : "Predict"}
//                                     </Button>
//                                     <Button
//                                         variant="outlined"
//                                         sx={{ marginTop: 2 }}
//                                         onClick={togglePredictionType}
//                                         fullWidth
//                                     >
//                                         Switch to {predictionType === "binary" ? "Multi-Class" : "Binary"}
//                                     </Button>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//
//                         <Grid item xs={12} md={6}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Prediction Results</Typography>
//                                     {predictionResult.length ? (
//                                         <Box>
//                                             <Typography variant="body1" gutterBottom>Predictions Distribution</Typography>
//                                             <Pie data={chartData} />
//                                         </Box>
//                                     ) : (
//                                         <Typography>No predictions yet!</Typography>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//
//                         <Grid item xs={12}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Prediction Trends</Typography>
//                                     <Line data={chartData} />
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//
//                         <Grid item xs={12}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Bar Chart</Typography>
//                                     <Bar data={chartData} />
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Box>
//         </Box>
//     );
// };
//
// export default DashboardPage;
//
//






// import {
//     AppBar,
//     Toolbar,
//     Typography,
//     Button,
//     Box,
//     Drawer,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Container,
//     Grid,
//     Card,
//     CardContent,
//     CircularProgress,
// } from '@mui/material';
// import {
//     UploadFile,
//     Dashboard as DashboardIcon,
//     Analytics as AnalyticsIcon,
//     Settings as SettingsIcon,
// } from '@mui/icons-material';
// import { Bar, Line, Pie } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { useNavigate } from "react-router-dom";
// import React, {useEffect, useState} from 'react';
//
// const DashboardPage = () => {
//     const [file, setFile] = useState(null);
//     const [predictionResult, setPredictionResult] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const [user, setUser] = useState({ name: '', profileImage: '' });
//
//     // Fetch user info from the backend
//     const fetchUserInfo = async () => {
//         try {
//             const response = await fetch('http://localhost:8080/api/user/info', {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch user info');
//
//             const userInfo = await response.json();
//
//             setUser({ name: userInfo.username, profileImage: userInfo.profileImage });
//
//         } catch (error) {
//             console.error('Failed to fetch user info:', error);
//         }
//     };
//
//     useEffect(() => {
//         fetchUserInfo();
//     }, []);
//
//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//     };
//
//     const handlePrediction = async () => {
//         if (!file) {
//             alert("Please upload a file before submitting.");
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append("file", file);
//
//         try {
//             setIsLoading(true);
//             const response = await fetch("http://localhost:5000/predict", {
//                 method: "POST",
//                 body: formData,
//             });
//
//             if (!response.ok) {
//                 const errorResponse = await response.json();
//                 throw new Error(errorResponse.error || "Prediction failed.");
//             }
//
//             const result = await response.json();
//             setPredictionResult(result);
//         } catch (error) {
//             alert(`An error occurred: ${error.message}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const renderPredictionResults = () => {
//         if (!predictionResult) return <Typography>No predictions yet!</Typography>;
//
//         if (predictionResult.message) {
//             return (
//                 <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#d4edda', borderRadius: 2 }}>
//                     <Typography variant="h6" color="green">{predictionResult.message}</Typography>
//                 </Box>
//             );
//         }
//
//         const { confidences, trends, riskLevels } = predictionResult;
//
//         return (
//             <Box>
//                 <Box sx={{ marginBottom: 4 }}>
//                     <Typography variant="h6">Confidence Plot</Typography>
//                     <Bar
//                         data={{
//                             labels: Object.keys(confidences),
//                             datasets: [
//                                 {
//                                     label: 'Confidence',
//                                     data: Object.values(confidences),
//                                     backgroundColor: '#42a5f5',
//                                 },
//                             ],
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ marginBottom: 4 }}>
//                     <Typography variant="h6">Prediction Trends</Typography>
//                     <Line
//                         data={{
//                             labels: Object.keys(trends),
//                             datasets: [
//                                 {
//                                     label: 'Trends',
//                                     data: Object.values(trends),
//                                     borderColor: '#66bb6a',
//                                     fill: false,
//                                 },
//                             ],
//                         }}
//                     />
//                 </Box>
//                 <Box>
//                     <Typography variant="h6">Risk Levels</Typography>
//                     <Pie
//                         data={{
//                             labels: Object.keys(riskLevels),
//                             datasets: [
//                                 {
//                                     label: 'Risk Levels',
//                                     data: Object.values(riskLevels),
//                                     backgroundColor: ['#f44336', '#ffa726', '#4caf50'],
//                                 },
//                             ],
//                         }}
//                     />
//                 </Box>
//             </Box>
//         );
//     };
//
//     return (
//         <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
//             <Drawer
//                 variant="permanent"
//                 sx={{
//                     width: 260,
//                     flexShrink: 0,
//                     [`& .MuiDrawer-paper`]: { width: 260, boxSizing: 'border-box', backgroundColor: '#1e293b', color: '#ffffff' },
//                 }}
//             >
//                 <Typography variant="h5" sx={{ textAlign: 'center', padding: 2, backgroundColor: '#0f172a' }}>
//                     IoMT Dashboard
//                 </Typography>
//                 <List>
//                     {[{ text: "Dashboard", icon: <DashboardIcon /> },
//                         { text: "Analytics", icon: <AnalyticsIcon /> },
//                         { text: "Settings", icon: <SettingsIcon /> }]
//                         .map(({ text, icon }) => (
//                             <ListItem button key={text}>
//                                 <ListItemIcon sx={{ color: '#ffffff' }}>{icon}</ListItemIcon>
//                                 <ListItemText primary={text} />
//                             </ListItem>
//                         ))}
//                 </List>
//             </Drawer>
//
//             <Box sx={{ flexGrow: 1, padding: 4 }}>
//                 <AppBar position="static" sx={{ background: '#334155', borderRadius: 2, marginBottom: 2 }}>
//                     <Toolbar>
//                         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//                             Modern Dashboard
//                         </Typography>
//                         <Button color="inherit" onClick={() => { navigate("/LoginForm") }}>
//                             Log Out
//                         </Button>
//                     </Toolbar>
//                 </AppBar>
//
//                 <Container>
//                     <Grid container spacing={4}>
//                         <Grid item xs={12} md={6}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Upload File for Prediction</Typography>
//                                     <Button
//                                         variant="contained"
//                                         component="label"
//                                         sx={{ marginBottom: 2 }}
//                                     >
//                                         Upload File
//                                         <input type="file" hidden onChange={handleFileChange} />
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         onClick={handlePrediction}
//                                         disabled={isLoading}
//                                         fullWidth
//                                     >
//                                         {isLoading ? <CircularProgress size={24} /> : "Predict"}
//                                     </Button>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//
//                         <Grid item xs={12} md={6}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Download Predictions</Typography>
//                                     <Button variant="contained" fullWidth>
//                                         Download Results
//                                     </Button>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//
//                         <Grid item xs={12}>
//                             <Card>
//                                 <CardContent>
//                                     <Typography variant="h6" gutterBottom>Prediction Results</Typography>
//                                     {renderPredictionResults()}
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Box>
//         </Box>
//     );
// };
//
// export default DashboardPage;









import React, { useState, useEffect } from 'react';
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
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const [file, setFile] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', profileImage: '' });

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
            setUser({ name: userInfo.username, profileImage: userInfo.profileImage });

        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Prediction failed.");
            }

            const result = await response.json();
            setPredictionResult(result);
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPredictionResults = () => {
        if (!predictionResult) return <Typography>No predictions yet!</Typography>;

        if (predictionResult.message) {
            return (
                <Box sx={{ textAlign: 'center', padding: 2, backgroundColor: '#d4edda', borderRadius: 2 }}>
                    <Typography variant="h6" color="green">{predictionResult.message}</Typography>
                </Box>
            );
        }

        const { confidences, trends, riskLevels } = predictionResult;

        return (
            <Box>
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h6">Confidence Plot</Typography>
                    <Bar
                        data={{
                            labels: Object.keys(confidences),
                            datasets: [
                                {
                                    label: 'Confidence',
                                    data: Object.values(confidences),
                                    backgroundColor: '#42a5f5',
                                },
                            ],
                        }}
                    />
                </Box>
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h6">Prediction Trends</Typography>
                    <Line
                        data={{
                            labels: Object.keys(trends),
                            datasets: [
                                {
                                    label: 'Trends',
                                    data: Object.values(trends),
                                    borderColor: '#66bb6a',
                                    fill: false,
                                },
                            ],
                        }}
                    />
                </Box>
                <Box>
                    <Typography variant="h6">Risk Levels</Typography>
                    <Pie
                        data={{
                            labels: Object.keys(riskLevels),
                            datasets: [
                                {
                                    label: 'Risk Levels',
                                    data: Object.values(riskLevels),
                                    backgroundColor: ['#f44336', '#ffa726', '#4caf50'],
                                },
                            ],
                        }}
                    />
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 260,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 260, boxSizing: 'border-box', backgroundColor: '#1e293b', color: '#ffffff' },
                }}
            >
                <Typography variant="h5" sx={{ textAlign: 'center', padding: 2, backgroundColor: '#0f172a' }}>
                    IoMT Dashboard
                </Typography>
                <List>
                    {[{ text: "Dashboard", icon: <DashboardIcon /> },
                        { text: "Analytics", icon: <AnalyticsIcon /> },
                        { text: "Settings", icon: <SettingsIcon /> }]
                        .map(({ text, icon }) => (
                            <ListItem button key={text}>
                                <ListItemIcon sx={{ color: '#ffffff' }}>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                </List>
            </Drawer>

            <Box sx={{ flexGrow: 1, padding: 4 }}>
                <AppBar position="static" sx={{ background: '#334155', borderRadius: 2, marginBottom: 2 }}>
                    <Toolbar>
                        <Avatar alt={user.name} src={user.profileImage} sx={{ marginRight: 2 }} />
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {user.name}
                        </Typography>
                        <Button color="inherit" onClick={() => { navigate("/LoginForm") }} sx={{ backgroundColor: '#f44336', width: '10%' }}>
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
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        Upload File
                                        <input type="file" hidden onChange={handleFileChange} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handlePrediction}
                                        disabled={isLoading}
                                        fullWidth
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : "Predict"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Download Predictions</Typography>
                                    <Button variant="contained" fullWidth>
                                        Download Results
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

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
