const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/AdminModel");
const ClaimPolicy = require("../models/ClaimPolicy");
const Notification = require("../models/NotificationModel");
const User = require("../models/UserModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ admin }, process.env.SECRET_JWT_KEY);

    res.status(200).json({
      message: "Admin logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await ClaimPolicy.findById(claimId);

    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    const userId = claim.userId;

    claim.claimStatus = "approved";

    await claim.save();

    const claimNotification = new Notification({
      userId: userId,
      message: `Your policy id ${claim.policyId}, Has been approved.`,
      isRead: false,
      status: "success",
    });

    await claimNotification.save();

    await User.findByIdAndUpdate(userId, {
      $push: { notifications: claimNotification._id },
    });

    res
      .status(200)
      .json({ message: "Claim approved successfully", claim, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.rejectClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { rejectReason } = req.body;

    const claim = await ClaimPolicy.findById(claimId);

    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    const userId = claim.userId;

    claim.claimStatus = "rejected";
    claim.rejectedReason = rejectReason;

    await claim.save();

    const claimNotification = new Notification({
      userId: userId,
      message: `Your policy id ${claim.policyId}, has been rejected. Reason: ${rejectReason}`,
      isRead: false,
      status: "reject",
    });

    await claimNotification.save();

    await User.findByIdAndUpdate(userId, {
      $push: { notifications: claimNotification._id },
    });

    res
      .status(200)
      .json({ message: "Claim rejected successfully", claim, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await ClaimPolicy.findById(claimId);

    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    res.status(200).json({ claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllPendingClaims = async (req, res) => {
  try {
    const pendingClaims = await ClaimPolicy.find({ claimStatus: "pending" });

    res.status(200).json({ pendingClaims });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
      .populate("boughtPolicies")
      .populate("claimedPolicies");

    res.status(200).json({ allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRejectedOrApprovedPolicy = async (req, res) => {
  try {
    const { status } = req.params;

    if (status === "rejected" || status === "approved") {
      const policies = await ClaimPolicy.find({ claimStatus: status });

      res
        .status(200)
        .json({ message: `Fetching ${status} policies`, policies });
    } else {
      res.status(400).json({ error: "Invalid status parameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
