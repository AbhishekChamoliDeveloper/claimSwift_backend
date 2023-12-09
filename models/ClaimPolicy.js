const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const claimPolicySchema = new Schema({
  policyId: {
    type: Schema.Types.ObjectId,
    ref: "AvailablePolicy",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  submittedDate: {
    type: Date,
    default: Date.now,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  dateTimeOfIncident: {
    type: Date,
  },
  locationOfIncident: {
    type: String,
  },
  policeReportNumber: {
    type: String,
  },
  witnessInformation: {
    type: String,
  },
  otherPartyInformation: {
    type: String,
  },
  photoOrVideoLink: {
    type: String,
  },
  supportingDocument: {
    type: String,
  },
  bankAccountDetail: {
    type: String,
  },
  signature: {
    type: String,
  },
  rejectedReason: {
    type: String,
  },
  claimStatus: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
});

const ClaimPolicy = mongoose.model("ClaimPolicy", claimPolicySchema);

module.exports = ClaimPolicy;
