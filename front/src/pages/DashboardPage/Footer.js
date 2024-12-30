import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => (
    <Box
        sx={{
            p: 2,
            bgcolor: "#1976d2",
            color: "#fff",
            textAlign: "center",
        }}
    >
        <Typography variant="body2">© 2024 IoMT Intrusion Detection System. All rights reserved.</Typography>
    </Box>
);

export default Footer;
