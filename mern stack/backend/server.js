const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const nodemailer = require("nodemailer");
const User = require("./modules/Users");
const Project = require("./modules/Project");
const Task = require("./modules/Task");
const TimeLog = require("./modules/TaskLog");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Updated CORS configuration
const corsOptions = {
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,              // Allow cookies
};
app.use(cors(corsOptions));

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes.",
});
app.use(limiter);

// JWT Helper Function
const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/api/invitation", async (req, res) => {
    try {
        const { name, mail_id, password, phone, department, business_unit } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ mail_id });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, mail_id, password: hashedPassword, phone, department, business_unit });
        await newUser.save();

        // Email setup
        const transporter = nodemailer.createTransport({
            service: "gmail", // Change to your email provider
            auth: {
                user: process.env.EMAIL_USER, // Add your email credentials to .env
                pass: process.env.EMAIL_PASS,
            },
        });

        const loginUrl = "http://localhost:3000/login"; // Login page URL
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: mail_id,
            subject: "You Have Been Invited to Register",
            html: `
                <p>Hello ${name},</p>
                <p>You have been registered on our platform. Here are your login details:</p>
                <ul>
                    <li><b>Email:</b> ${mail_id}</li>
                    <li><b>Password:</b> ${password}</li>
                </ul>
                <p>You can log in using the following link:</p>
                <a href="${loginUrl}">Login Here</a>
                <p>Thank you!</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered successfully and email sent." });
    } catch (error) {
        console.error("Error registering user or sending email:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
    try {
        const { mail_id, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ mail_id });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate JWT token with user role
        const token = generateToken({ mail_id: user.mail_id, role: user.role });

        // Set the token in a secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 hour
        });

        // Respond with success and user role
        res.status(200).json({
            message: "Login successful.",
            role: user.role,
        });
    } catch (error) {
        console.error("Error logging in user:", error.message || error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// Protected Route
app.get("/api/protected", (req, res) => {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: "Unauthorized." });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token." });
        // console.log(decoded);
        res.json({ message: "Access granted.", user: decoded });
    });
});

app.get("/api/users", async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: "admin" } }); // Exclude admin users
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user." });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, mail_id, phone, department, business_unit } = req.body;
  
    try {
      // Find the user by ID and update
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          mail_id,
          phone,
          department,
          business_unit,
        },
        { new: true } // Return the updated user document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  

  app.post("/api/projects", async (req, res) => {
  try {
    const {
      project_name,
      client_name,
      address,
      department,
      business_unit,
      project_type,
      users, // Array of user mail_ids
    } = req.body;

    const project = new Project({
      project_name,
      client_name,
      address,
      department,
      business_unit,
      project_type,
      // users: users.map((user) => ({ mail_id: user.mail_id })), // Ensure only mail_id is saved
      users: users ? users.map((user) => ({ mail_id: user.mail_id })) : [],
    });
    // console.log(project);

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
  
  app.get("/api/projectusers", async (req, res) => {
    try {
      const { department, business_unit } = req.query;
  
      const users = await User.find({ department, business_unit });
      // console.log(users);
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/projectlistall", async (req, res) => {
    try {
      const projects = await Project.find();
      // console.log(projects);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  
  // GET: Get a specific project by ID
  app.get("/projectlistall/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project details" });
    }
  });
  app.delete('/projectlist/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting project', error });
    }
  });
  // PUT request to update project users
  app.put("/projectlistall/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const project = await Project.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
      });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project", error });
    }
  });

  
  app.get("/users/:mail_id", async (req, res) => {
    try {
      const user = await User.findOne({ mail_id: req.params.mail_id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/employees/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await User.findById(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // 2. Update employee details
  app.put("/employees/:mail_id", async (req, res) => {
    const { mail_id } = req.params;
    const updateData = req.body;
  
    try {
      const employee = await User.findOneAndUpdate({ mail_id }, updateData, {
        new: true,
      });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // 3. Get projects for an employee by mail_id
  app.get("/employees/:mail_id/projects", async (req, res) => {
    const { mail_id } = req.params;
  
    try {
      const projects = await Project.find({ "users.mail_id": mail_id });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects for employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

  
  app.get("/projects/:id/users", async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Return the users associated with the project
      res.json({ users: project.users });
    } catch (error) {
      console.error("Error fetching users for project:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/projects/:id/tasks", async (req, res) => {
    const { task_name, planned_hours, description, assigned_user } = req.body;
  
    try {
      // Validate project existence
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const task = new Task({
        project_id: req.params.id,
        task_name,
        planned_hours,
        actual_hours:planned_hours,
        description,
        assigned_user, // Assign the user
      });
  
      await task.save();
      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


  app.get("/projects/:projectId/tasks", async (req, res) => {
    const { projectId } = req.params;
  
    try {
      const tasks = await Task.find({ project_id: projectId });
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks for project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/tasks/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const updateData = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/tasks/:taskId", async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/employees/:mail/projects", async (req, res) => {
    const { mail } = req.params;
  
    try {
      // Find projects where the employee is assigned
      const projects = await Project.find({ "users.mail_id": mail }).select(
        "project_name project_type status"
      );
  
      if (!projects.length) {
        return res.status(404).json({ message: "No projects found for this employee" });
      }
  
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects for employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get tasks for a specific project
  app.get("/projects/:id/tasks", async (req, res) => {
    const { id } = req.params;

    try {
      const tasks = await Task.find({ project_id: id }); // Find tasks for the project
      if (!tasks || tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found for this project." });
      }

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  // Get task by task ID
  app.get("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  app.post("/tasks/:taskId/timelog", async (req, res) => {
    const { taskId } = req.params;
    const { date, hours_spent, start_time, end_time, status } = req.body;
  
    try {
      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }
  
      // Add the timelog entry
      const timelogEntry = { date, hours_spent, start_time, end_time, status };
      task.timelogs.push(timelogEntry); // Assuming "timelogs" is an array in the Task schema
  
      await task.save(); // Save the updated task
      res.status(201).json({ message: "Timelog entry added successfully.", timelog: timelogEntry });
    } catch (error) {
      console.error("Error adding timelog entry:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  app.post("/timelogs/:id", async (req, res) => {
    const { id } = req.params; // Extract task ID from URL
    const { mail_id, date, start_time, end_time, hours_spent, status } = req.body;
  
    // Validate input fields
    if (!mail_id || !date || !start_time || !end_time || !hours_spent || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const startTimeMinutes = parseInt(start_time.split(":")[0]) * 60 + parseInt(start_time.split(":")[1]);
      const endTimeMinutes = parseInt(end_time.split(":")[0]) * 60 + parseInt(end_time.split(":")[1]);
      if (endTimeMinutes <= startTimeMinutes) {
        return res.status(400).json({ error: "End time must be later than start time" });
      }
  
      // Create a new timelog entry
      const timelogEntry = {
        user: mail_id,
        date,
        start_time,
        end_time,
        hours_spent,
        status,
      };
  
      // Find the TimeLog document for the given task ID and add the new entry
      const timeLog = await TimeLog.findOneAndUpdate(
        { task_id: id }, // Match the task ID
        {
          $push: { timelog: timelogEntry }, // Add new timelog entry
          // status, // Update the task's status
        },
        { new: true, upsert: true } // Create a new document if one doesn't exist
      );

      const task = await Task.findByIdAndUpdate(
        id, // Match the task ID
        { status }, // Update the task's status
        { new: true }
      );

      const taks = await Task.findById(id);

      const projectidfromtask = taks.project_id;

      const tasklistall = await Task.find({ project_id: projectidfromtask }).populate("project_id");

      const allCompleted = tasklistall.every((task) => task.status === "Completed");

      if(allCompleted){
        const project001 = await Project.findByIdAndUpdate(projectidfromtask, 
          {status},
          {new: true}, // Return the updated document
        );
        if (!project001) {
          return res.status(404).json({ message: "Project not found" });
        }
      }
      else{
        const project001 = await Project.findByIdAndUpdate(projectidfromtask, 
          {status:"In Progress"},
          {new: true}, // Return the updated document
        );
        if (!project001) {
          return res.status(404).json({ message: "Project not found" });
        }
      }



      if(status==="Completed"){

      
        const timeLogs = await TimeLog.find({ task_id: id });
    
        if (!timeLogs || timeLogs.length === 0) {
          return res.status(404).json({ message: "No time logs found for this task." });
        }
        let totalActualHours = 0;
    
        timeLogs.forEach((log) => {
          log.timelog.forEach((entry) => {
            totalActualHours += entry.hours_spent;
          });
        });

        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { actual_hours: totalActualHours },
          { new: true } // Return the updated document
        );

        if (!updatedTask) {
          return res.status(404).json({ message: "Task not found." });
        }
    
      }

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      res.status(201).json({ message: "Timelog added successfully", timeLog, task });
    } catch (error) {
      console.error("Error adding timelog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/timelogs", async (req, res) => {
    try {
      const timeLogs = await TimeLog.find()
        .populate("task_id", "task_name description assigned_user") // Task details
        .populate("timelog.user", "name email"); // User details
  
      res.status(200).json(timeLogs);
    } catch (error) {
      console.error("Error fetching time logs:", error);
      res.status(500).json({ error: "Failed to fetch time logs" });
    }
  });

  app.get("/usertimelogs", async (req, res) => {
    const { mail_id } = req.query;
  
    try {
      const timeLogs = await TimeLog.find({ "timelog.user": mail_id })
        .populate("task_id");
      res.json(timeLogs);
    } catch (error) {
      console.error("Error fetching time logs:", error);
      res.status(500).json({ error: "Failed to fetch time logs." });
    }
  });
  

  app.get("/projecttasks/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const tasks = await Task.find({ project_id: id }).populate("project_id");
      if (!tasks || tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found for this project." });
      }
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks by project_id:", error);
      res.status(500).json({ error: "Failed to fetch tasks." });
    }
  });

  app.put("/tasks/:id", async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

    app.get("/totalEmployees", async (req, res) => {
    try {
      const totalEmployees = await User.countDocuments(); // Counts total employees
      res.status(200).json({ totalEmployees });
    } catch (error) {
      console.error("Error fetching total number of employees:", error);
      res.status(500).json({ error: "Failed to fetch total number of employees" });
    }
  });

  app.get("/timelogs/grouped", async (req, res) => {
    const { timeframe } = req.query; // e.g., day, week, month, year
  
    try {
      const timeLogs = await TimeLog.find().populate("task_id", "task_name assigned_user");
  
      // Group time logs based on the timeframe
      const groupedLogs = timeLogs.flatMap((log) =>
        log.timelog.map((entry) => {
          const date = new Date(entry.date);
          return {
            user: entry.user,
            task_name: log.task_id.task_name,
            date: entry.date,
            hours_spent: entry.hours_spent,
            status: entry.status,
            timeframeKey:
              timeframe === "day"
                ? date.toISOString().split("T")[0] // YYYY-MM-DD
                : timeframe === "week"
                ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}` // YYYY-WW
                : timeframe === "month"
                ? `${date.getFullYear()}-${date.getMonth() + 1}` // YYYY-MM
                : timeframe === "year"
                ? `${date.getFullYear()}` // YYYY
                : "unknown",
          };
        })
      );
  
      // Aggregate the logs based on the timeframeKey
      const aggregatedLogs = groupedLogs.reduce((acc, log) => {
        if (!acc[log.timeframeKey]) {
          acc[log.timeframeKey] = [];
        }
        acc[log.timeframeKey].push(log);
        return acc;
      }, {});
  
      res.status(200).json(aggregatedLogs);
    } catch (error) {
      console.error("Error fetching grouped time logs:", error);
      res.status(500).json({ error: "Failed to fetch grouped time logs." });
    }
  });

  // app.get("/projecttasksdata/:id", async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     const tasks = await Task.find({ project_id: id })
  //       .populate("project_id")
  //       .populate({
  //         path: "timelog", // Populate the time logs
  //         select: "hours_spent status", // Fetch relevant fields
  //       });
  
  //     if (!tasks || tasks.length === 0) {
  //       return res.status(404).json({ message: "No tasks found for this project." });
  //     }
  
  //     res.status(200).json(tasks);
  //   } catch (error) {
  //     console.error("Error fetching tasks by project_id:", error);
  //     res.status(500).json({ error: "Failed to fetch tasks." });
  //   }
  // });

  // app.put("/actualhour/:id", async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     // Fetch all time logs for the task
  //     const timeLogs = await TimeLog.find({ task_id: id });
  
  //     if (!timeLogs || timeLogs.length === 0) {
  //       return res.status(404).json({ message: "No time logs found for this task." });
  //     }
  
  //     // Calculate total actual hours
  //     let totalActualHours = 0;
  
  //     timeLogs.forEach((log) => {
  //       log.timelog.forEach((entry) => {
  //         totalActualHours += entry.hours_spent;
  //       });
  //     });
  
  //     // Update the task with the calculated actual hours
  //     const updatedTask = await Task.findByIdAndUpdate(
  //       id,
  //       { actual_hours: totalActualHours },
  //       { new: true } // Return the updated document
  //     );
  
  //     if (!updatedTask) {
  //       return res.status(404).json({ message: "Task not found." });
  //     }
  
  //     res.status(200).json({
  //       message: "Actual hours updated successfully.",
  //       task: updatedTask,
  //     });
  //   } catch (error) {
  //     console.error("Error updating actual hours:", error);
  //     res.status(500).json({ error: "Failed to update actual hours." });
  //   }
  // });

  
// Logout Endpoint

  app.get("/projecttasksdataall/:id", async (req, res) =>{
    const { id } = req.params;

    try{
      const tasks = await Task.find({ project_id: id });
      if (!tasks) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(tasks);

    }
    catch (error) {
          console.error("Error fetching tasks by project_id:", error);
          res.status(500).json({ error: "Failed to fetch tasks." });
    }
  })

  app.get("/projects/summary", async (req, res) => {
    try {
      const totalProjects = await Project.countDocuments();
      const completedProjects = await Project.countDocuments({ status: "Completed" });
      const inProgressProjects = await Project.countDocuments({ status: "In Progress" });
      const todoProjects = await Project.countDocuments({ status: "To do" });

      const summary = {
        total: totalProjects,
        Completed: completedProjects,
        "In Progress": inProgressProjects,
        "To Do": todoProjects,
      };

      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching project summary:", error);
      res.status(500).json({ error: "Failed to fetch project summary." });
    }
  });

  app.get("/tasks/:projectId", async (req, res) => {
    const { projectId } = req.params;
    const { timeframe, date } = req.query;
  
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
  
    try {
      const tasks = await Task.find({ project_id: projectId });
  
      if (!tasks.length) {
        return res.status(200).json({ message: "No tasks found for this project" });
      }
  
      let filteredTasks = tasks;
  
      // Parse the `date` query parameter
      const selectedDate = date ? new Date(date) : null;
  
      if (timeframe && selectedDate) {
        filteredTasks = tasks.filter((task) => {
          const taskDate = new Date(task.date);
  
          if (timeframe === "day") {
            // Compare year, month, and day
            return (
              taskDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
              taskDate.getUTCMonth() === selectedDate.getUTCMonth() &&
              taskDate.getUTCDate() === selectedDate.getUTCDate()
            );
          } else if (timeframe === "week") {
            // Get ISO week numbers for comparison
            const taskWeek = Math.ceil(taskDate.getUTCDate() / 7);
            const selectedWeek = Math.ceil(selectedDate.getUTCDate() / 7);
  
            return (
              taskDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
              taskDate.getUTCMonth() === selectedDate.getUTCMonth() &&
              taskWeek === selectedWeek
            );
          } else if (timeframe === "month") {
            // Compare year and month
            return (
              taskDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
              taskDate.getUTCMonth() === selectedDate.getUTCMonth()
            );
          } else if (timeframe === "year") {
            // Compare year only
            const selectedYear = parseInt(date, 10);
            return taskDate.getUTCFullYear() === selectedYear;
          }
  
          return false; // Default fallback
        });
      }
  
      res.status(200).json(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/:projectId", async (req, res) => {
    const { projectId } = req.params;
    const { timeframe, date, status } = req.query;
  
    try {
      // Parse the date and determine the start and end range based on timeframe
      const filterDate = new Date(date); // User-provided date
      let startDate, endDate;
  
      switch (timeframe) {
        case "day":
          startDate = new Date(filterDate.setHours(0, 0, 0, 0));
          endDate = new Date(filterDate.setHours(23, 59, 59, 999));
          break;
        case "week":
          const weekDay = filterDate.getDay();
          startDate = new Date(filterDate);
          startDate.setDate(filterDate.getDate() - weekDay);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 7);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "month":
          startDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
          endDate = new Date(filterDate.getFullYear(), filterDate.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case "year":
          startDate = new Date(filterDate.getFullYear(), 0, 1);
          endDate = new Date(filterDate.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
          break;
        default:
          return res.status(400).json({ error: "Invalid timeframe" });
      }
  
      // Build query
      const query = {
        project_id: projectId,
        date: { $gte: startDate, $lt: endDate },
      };
  
      // Include status filter if provided
      if (status) {
        query.status = status;
      }
  
      // Fetch tasks
      const tasks = await Task.find(query);
  
      // Send response
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.put("/projecthourupdate/:id", async (req, res)=>{
    const {id} = req.params;
    const {plannedhour,actualhour} = req.query;

    const updateprojecthour = await Project.findByIdAndUpdate(
      id, // Match the task ID
        { planned_hour:plannedhour },
         // Update the task's status
        { new: true }
    );
    const updateprojecthour1 = await Project.findByIdAndUpdate(
      id, // Match the task ID
      { actual_hour:actualhour },
         // Update the task's status
        { new: true }
    );

    if (!updateprojecthour || !updateprojecthour1) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updateprojecthour);
  })
  
  app.get("/projecthours", async (req, res) => {
    try {
      // Fetch all projects with planned and actual hours
      const projects = await Project.find();
  
      // Respond with project data
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching project hours:", error);
      res.status(500).json({ error: "Failed to fetch project hours" });
    }
  });
  
  
  app.get("/employeeperformance/:mail_id", async (req, res) => {
    try {
      const tasks = await Task.find({ assigned_user: req.params.mail_id });
  
      if (tasks.length === 0) {
        return res.status(404).json({ error: "No tasks found for the provided user" });
      }
  
      // Calculate performance for each task
      const performanceData = tasks.map((task) => {
        const performance =
          task.actual_hours <= task.planned_hours
            ? 100 - ((task.planned_hours - task.actual_hours) / task.planned_hours) * 100
            : 100 - ((task.actual_hours - task.planned_hours) / task.planned_hours) * 100;
  
        return {
          employee: task.assigned_user,
          task: task.task_name,
          planned_hours: task.planned_hours,
          actual_hours: task.actual_hours,
          performance: Math.max(0, performance),
        };
      });
  
      // Calculate overall performance
      const totalPlannedHours = tasks.reduce((sum, task) => sum + task.planned_hours, 0);
      const totalActualHours = tasks.reduce((sum, task) => sum + task.actual_hours, 0);
      let overallPerformance = 100;
  
      if (totalPlannedHours > 0) {
        if (totalActualHours <= totalPlannedHours) {
          overallPerformance = 100 - ((totalPlannedHours - totalActualHours) / totalPlannedHours) * 100;
        } else {
          overallPerformance = 100 - ((totalActualHours - totalPlannedHours) / totalPlannedHours) * 100;
        }
      }

      console.log(overallPerformance);
      res.status(200).json({
        // tasks: performanceData,
        overallPerformance: Math.max(0, overallPerformance), // Ensure it doesn't go below 0
      });
    } catch (error) {
      console.error("Error fetching employee performance data:", error);
      res.status(500).json({ error: "Failed to fetch performance data" });
    }
  });
  
  app.get("/allEmployeePerformance", async (req, res) => {
    try {
      const tasks = await Task.find(); // Fetch all tasks
  
      const performanceMap = {}; // To store performance data grouped by employee
  
      // Calculate performance per task and group by employee
      tasks.forEach((task) => {
        const performance =
          task.actual_hours <= task.planned_hours
            ? 100 - ((task.planned_hours - task.actual_hours) / task.planned_hours) * 100
            : 100 - ((task.actual_hours - task.planned_hours) / task.planned_hours) * 100;
  
        const employee = task.assigned_user;
  
        // Initialize if employee not yet in the map
        if (!performanceMap[employee]) {
          performanceMap[employee] = { totalPerformance: 0, taskCount: 0 };
        }
  
        // Accumulate performance and task count
        performanceMap[employee].totalPerformance += Math.max(0, performance);
        performanceMap[employee].taskCount += 1;
      });
  
      // Calculate overall performance for each employee
      const overallPerformanceData = Object.keys(performanceMap).map((employee) => {
        const { totalPerformance, taskCount } = performanceMap[employee];
        return {
          employee,
          overallPerformance: (totalPerformance / taskCount).toFixed(2), // Average performance
        };
      });
  
      res.status(200).json({ overallPerformanceData });
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ error: "Failed to fetch performance data" });
    }
  });
  
app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully." });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
