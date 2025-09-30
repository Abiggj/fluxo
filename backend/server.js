const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const teamRoutes = require("./src/routes/teamRoutes");
const workRoutes = require("./src/routes/workRoutes");
const invitationRoutes = require("./src/routes/invitationRoutes");
const userRoutes = require("./src/routes/userRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const { errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/works", workRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
