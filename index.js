const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors"); // Added CORS import

const app = express();
app.use(cors()); // Added CORS middleware
app.use(express.json());

// Connect Database
connectDB();

// Import Routes
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/lawyers", require("./routes/lawyerRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/schedules", require("./routes/scheduleRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
// app.use("/api/payments", require("./routes/paymentRoutes"));
// app.use("/api/admins", require("./routes/adminRoutes"));
// app.use("/api/notifications", require("./routes/notificationRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
