const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        mail_id: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        department: { type: String, required: true },
        business_unit: { type: String, required: true },
        role: {
            type: String,
            enum: ["user", "admin"], // Restricts the role to these two values
            default: "user",        // Default role is "user"
        },
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

module.exports = mongoose.model("users", userSchema);
