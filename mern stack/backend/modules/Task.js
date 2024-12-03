// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, // Reference to the Project
//   task_name: { type: String, required: true },
//   planned_hours: { type: Number, required: true },
//   users: [
//     {
//       _id: { type: String, required: true },
//     },
//   ],
//   status: {
//     type: String,
//     enum: ["To Do", "In Progress", "Completed"],
//     default: "To Do",
//   },
//   description: { type: String },
// });

// module.exports = mongoose.model("Task", taskSchema);


// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema(
//   {
//     project_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true, // Reference to the Project
//     },
//     task_name: {
//       type: String,
//       required: true,
//     },
//     planned_hours: {
//       type: Number,
//       required: true,
//     },
//     users: [
//       {
//         user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["To Do", "In Progress", "Completed"],
//       default: "To Do",
//     },
//     description: {
//       type: String, // Optional task description
//     },
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// module.exports = mongoose.model("Task", taskSchema);\\



// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   project_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Project",
//     required: true,
//   }, // Reference to the Project
//   task_name: { type: String, required: true }, // Name of the task
//   planned_hours: { type: Number, required: true }, // Planned hours for the task
//   assigned_user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "users",
//     required: true, // User assigned to the task
//   }, // Reference to the Employee
//   status: {
//     type: String,
//     enum: ["To Do", "In Progress", "Completed"],
//     default: "To Do",
//   }, // Status of the task
//   description: { type: String }, // Description of the task
//   timelogs: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: "users", }, // User who logs the time
//       date: { type: Date, }, // Date of the time log
//       start_time: { type: String, }, // Start time (e.g., "09:00 AM")
//       end_time: { type: String,  }, // End time (e.g., "05:00 PM")
//       hours_spent: { type: Number,  }, // Total hours spent
//       status: {
//         type: String,
//         enum: ["To Do", "In Progress", "Completed"],
//         // required: true, // Status of the task during the time log
//       },
//     },
//   ], // Array of time logs for the task
// });

// module.exports = mongoose.model("Task", taskSchema);


const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  }, // Reference to the Project
  task_name: { type: String, required: true }, // Name of the task
  planned_hours: { type: Number, required: true }, // Planned hours for the task
  actual_hours: { type: Number, default: 0 },
  assigned_user: {
    type:String,
    required:true
  },
    // User assigned to the task
   // Reference to the Employee
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  }, // Status of the task
  description: { type: String }, // Optional description of the task

  date: {
    type: Date,
    default: Date.now // Automatically sets the current date and time
  }
});

module.exports = mongoose.model("Task", taskSchema);


