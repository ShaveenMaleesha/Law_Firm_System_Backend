const mongoose = require("mongoose");

const LawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  practiceArea: [{ type: String, required: true }],
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  profilePicture: { 
    type: String, 
    validate: {
      validator: function(v) {
        // If profilePicture is provided, it should be a valid base64 data URL
        if (!v) return true; // Allow null/undefined
        return /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(v);
      },
      message: 'Profile picture must be a valid base64 image data URL'
    }
  },
  blogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  caseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
});

module.exports = mongoose.model("Lawyer", LawyerSchema);
