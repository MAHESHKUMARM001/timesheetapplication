const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  client_name: { type: String, required: true },
  address: { type: String },
  department: { type: String, required: true },
  business_unit: { type: String, required: true },
  project_type: { type: String, required: true },
  planned_hour: {type: Number, default: 0, },
  actual_hour: {type: Number, default: 0},
  users: [
    {
      mail_id: { type: String, required: true },
    },
  ],
  status:{
    type: String, required: true, default:"To do"
  },
  date: {
    type: Date,
    default: Date.now // Automatically sets the current date and time
  }
});

module.exports = mongoose.model("Project", projectSchema);
