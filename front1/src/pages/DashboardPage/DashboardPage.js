//
// import React, { useState, useEffect } from 'react';
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
//     Avatar,
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
//
// const DashboardPage = () => {
//     const [file, setFile] = useState(null);
//     const [predictionResult, setPredictionResult] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const [user, setUser] = useState({ name: '', profileImage: '' });
//
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
//                     IDS Dashboard
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
//                         <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
//                             <Avatar alt={user.name} src={user.profileImage} sx={{ marginRight: 1 }} />
//                             <Typography variant="h6">
//                                 {user.name}
//                             </Typography>
//                         </Box>
//                         <Button
//                             color="inherit"
//                             onClick={() => { navigate("/LoginForm") }}
//                             sx={{ backgroundColor: '#f44336', width: '10%' }}
//                         >
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
import {Bar, Line, Pie} from 'react-chartjs-2';
import 'chart.js/auto';
import {useNavigate} from "react-router-dom";

const DashboardPage = () => {
    const [file, setFile] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
                <Box sx={{textAlign: 'center', padding: 2, backgroundColor: '#d4edda', borderRadius: 2}}>
                    <Typography variant="h6" color="green">{predictionResult.message}</Typography>
                </Box>
            );
        }

        const {confidences, trends, riskLevels} = predictionResult;

        return (
            <Box>
                <Box sx={{marginBottom: 4}}>
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
                <Box sx={{marginBottom: 4}}>
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
                                                    onClick={()=> setFile(null)}
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
                        {predictionResult &&(
                        <Grid item xs={12} md={6} >
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Download Predictions</Typography>
                                    <Button variant="contained" fullWidth>
                                        Download Results
                                    </Button>
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
