const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true, // Reference to the associated task
  },
  timelog:[
    {
        user: {
            type: String,
            required: true, // User who logs the time
          },
          date: {
            type: Date,
            required: true, // Date of the time log
          },
          start_time: {
            type: String,
            required: true, // Start time (e.g., "09:00 AM")
          },
          end_time: {
            type: String,
            required: true, // End time (e.g., "05:00 PM")
          },
          hours_spent: {
            type: Number,
            required: true, // Total hours spent
          },
          status: {
            type: String,
            enum: ["To Do", "In Progress", "Completed"],
            required: true, // Status of the task during the time log
          },
    }
]
  ,
});

module.exports = mongoose.model("TimeLog", timeLogSchema);
