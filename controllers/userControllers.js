const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const BoughtPolicy = require("../models/BoughtPolicyModel");
const AvailablePolicy = require("../models/AvailablePoliciesModel");
const Notification = require("../models/NotificationModel");
const ClaimPolicy = require("../models/ClaimPolicy");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const welcomeNotification = new Notification({
      userId: newUser._id,
      message: `Welcome to claimSwift, ${firstName}`,
      isRead: false,
      status: "success",
    });

    await welcomeNotification.save();

    await User.findByIdAndUpdate(newUser._id, {
      $push: {
        notifications: welcomeNotification._id,
      },
    });

    const token = jwt.sign({ newUser }, process.env.SECRET_JWT_KEY);

    res.status(201).json({
      message: "User signed up successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ user }, process.env.SECRET_JWT_KEY);

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.settings = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const { profile_picture, dateOfBirth, mobileNumber, address, gender } =
      req.body;

    authenticatedUser.profile_picture = profile_picture;
    authenticatedUser.dateOfBirth = dateOfBirth;
    authenticatedUser.mobileNumber = mobileNumber;
    authenticatedUser.address = address;
    authenticatedUser.gender = gender;

    await authenticatedUser.save();

    const token = jwt.sign(
      {
        user: authenticatedUser.toObject(),
      },
      process.env.SECRET_JWT_KEY
    );

    res.status(200).json({
      message: "Settings updated successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.buyPolicy = async (req, res) => {
  try {
    // Extract data from request
    const { policyId } = req.params; // Assuming policyId is a parameter in the URL
    const {
      fullName,
      email,
      phoneNumber,
      address,
      dateOfBirth,
      socialSecurityNumber,
      gender,
      maritalStatus,
      occupation,
      annualIncome,
      healthCondition,
      uploadedDocument,
    } = req.body;
    const userId = req.user._id; // Assuming user data is stored in req.user

    // Check if the policyId corresponds to an existing AvailablePolicy
    const availablePolicy = await AvailablePolicy.findById(policyId);
    if (!availablePolicy) {
      return res.status(404).json({ error: "AvailablePolicy not found" });
    }

    // Create a new BoughtPolicy instance
    const newBoughtPolicy = new BoughtPolicy({
      policyId,
      userId,
      fullName,
      email,
      phoneNumber,
      address,
      dateOfBirth,
      socialSecurityNumber,
      gender,
      maritalStatus,
      occupation,
      annualIncome,
      healthCondition,
      uploadedDocument,
    });

    // Save the new BoughtPolicy instance to the database
    await newBoughtPolicy.save();

    const buyNotification = new Notification({
      userId: userId,
      message: `Thankyou for buying ${availablePolicy.coverage_type} policy. Your buying id is ${newBoughtPolicy._id}.`,
      isRead: false,
      status: "success",
    });

    await buyNotification.save();

    // Update the user's boughtPolicies array
    await User.findByIdAndUpdate(userId, {
      $push: { boughtPolicies: newBoughtPolicy._id },
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        notifications: buyNotification._id,
      },
    });

    // Send a success response
    res.status(201).json({
      message: "Policy bought successfully",
      boughtPolicy: newBoughtPolicy,
    });
  } catch (error) {
    console.error("Error buying policy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.claimPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const userId = req.user._id;

    const newClaimPolicy = new ClaimPolicy({
      policyId,
      userId,
      submittedData: new Date(),
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      dateTimeOfIncident: req.body.dateTimeOfIncident,
      locationOfIncident: req.body.locationOfIncident,
      policeReportNumber: req.body.policeReportNumber,
      witnessInformation: req.body.witnessInformation,
      otherPartyInformation: req.body.otherPartyInformation,
      photoOrVideoLink: req.body.photoOrVideoLink,
      supportingDocument: req.body.supportingDocument,
      bankAccountDetail: req.body.bankAccountDetail,
      signature: req.body.signature,
      rejectedReason: req.body.rejectedReason,
      claimStatus: "pending",
    });

    const savedClaimPolicy = await newClaimPolicy.save();

    const claimNotification = new Notification({
      userId: userId,
      message: `Your policy id ${policyId} has been added to claim list. You claim id is ${newClaimPolicy._id}. Wait for its approvel by admins.`,
      isRead: false,
      status: "success",
    });

    await claimNotification.save();

    await User.findByIdAndUpdate(userId, {
      $push: { claimedPolicies: newClaimPolicy._id },
    });

    await User.findByIdAndUpdate(userId, {
      $push: { notifications: claimNotification._id },
    });

    res.status(201).json(savedClaimPolicy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserInformation = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId)
      .populate("boughtPolicies notifications claimedPolicies")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
