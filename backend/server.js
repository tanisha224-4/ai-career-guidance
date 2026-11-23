
import express from "express";
import cors from "cors";
import "dotenv/config";
import dns from "node:dns";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// DNS Configuration
dns.setServers(["8.8.8.8"]);

// ==========================================
// APP CONFIGURATION
// ==========================================

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new MongoClient(
  MONGODB_URI || "mongodb://127.0.0.1:27017"
);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Collection
const getUsersCollection = () => {
  return client.db("careerguidancedb").collection("users");
};

// ==========================================
// HELPER FUNCTION
// ==========================================

function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || "",
    email: user.email || "",
    course: user.course || "",
    education: user.education || user.course || "",
    careerInterest: user.careerInterest || "",
    skills: Array.isArray(user.skills) ? user.skills : [],
    experience: user.experience || "Beginner",
  };
}

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token required.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Career Guidance Backend is running!",
  });
});

// ==========================================
// HEALTH CHECK API
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Backend API is working correctly.",
  });
});

// ==========================================
// USER REGISTRATION API
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      course,
      education,
      careerInterest,
      skills,
      experience,
    } = req.body;

    // Required field validation
    if (
      !name?.trim?.() ||
      !email?.trim?.() ||
      !password ||
      !(course?.trim?.() || education?.trim?.())
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      (course !== undefined && typeof course !== "string") ||
      (education !== undefined && typeof education !== "string") ||
      (careerInterest !== undefined &&
        typeof careerInterest !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const usersCollection = getUsersCollection();

    // Check existing user
    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const selectedEducation = (
      education || course
    ).trim();

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      course: selectedEducation,
      education: selectedEducation,

      careerInterest: careerInterest?.trim() || "",

      skills: Array.isArray(skills)
        ? skills
            .filter((skill) => typeof skill === "string")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],

      experience:
        typeof experience === "string" && experience.trim()
          ? experience.trim()
          : "Beginner",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      userId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
});

// ==========================================
// USER LOGIN API
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const usersCollection = getUsersCollection();

    const user = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
});

// ==========================================
// GET USER PROFILE API
// ==========================================

app.get(
  "/api/auth/profile",
  authenticateToken,
  async (req, res) => {
    try {
      if (!ObjectId.isValid(req.user.userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const usersCollection = getUsersCollection();

      const user = await usersCollection.findOne(
        {
          _id: new ObjectId(req.user.userId),
        },
        {
          projection: {
            password: 0,
          },
        }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        user: formatUser(user),
      });

    } catch (error) {
      console.error("Profile fetch error:", error.message);

      res.status(500).json({
        success: false,
        message: "Server error while fetching profile.",
      });
    }
  }
);

// ==========================================
// UPDATE USER PROFILE API
// ==========================================

app.put(
  "/api/auth/profile",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        name,
        education,
        careerInterest,
        skills,
        experience,
      } = req.body;

      // Validate required fields
      if (
        typeof name !== "string" ||
        typeof education !== "string" ||
        typeof careerInterest !== "string" ||
        !name.trim() ||
        !education.trim() ||
        !careerInterest.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, education and career interest are required.",
        });
      }

      if (
        skills !== undefined &&
        (!Array.isArray(skills) ||
          !skills.every((skill) => typeof skill === "string"))
      ) {
        return res.status(400).json({
          success: false,
          message: "Skills must be provided as an array of strings.",
        });
      }

      if (
        experience !== undefined &&
        typeof experience !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid experience value.",
        });
      }

      if (!ObjectId.isValid(req.user.userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const usersCollection = getUsersCollection();

      const userId = new ObjectId(req.user.userId);

      const updatedData = {
        name: name.trim(),
        course: education.trim(),
        education: education.trim(),
        careerInterest: careerInterest.trim(),

        skills: (skills || [])
          .map((skill) => skill.trim())
          .filter(Boolean),

        experience:
          experience?.trim() || "Beginner",

        updatedAt: new Date(),
      };

      // Update user in MongoDB
      const updateResult = await usersCollection.updateOne(
        { _id: userId },
        { $set: updatedData }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Fetch updated user
      const updatedUser = await usersCollection.findOne(
        { _id: userId },
        {
          projection: {
            password: 0,
          },
        }
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: formatUser(updatedUser),
      });

    } catch (error) {
      console.error("Profile update error:", error.message);

      res.status(500).json({
        success: false,
        message: "Server error while updating profile.",
      });
    }
  }
);

// ==========================================
// SAVE SKILL ASSESSMENT RESULT API
// ==========================================

app.post(
  "/api/assessment/save",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        score,
        total,
        percentage,
        answers,
        categoryResults,
        questions,
        date,
      } = req.body;

      if (!ObjectId.isValid(req.user.userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      if (
        typeof score !== "number" ||
        typeof total !== "number" ||
        typeof percentage !== "number" ||
        total <= 0 ||
        score < 0 ||
        score > total ||
        percentage < 0 ||
        percentage > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid assessment result data.",
        });
      }

      const assessmentCollection = client
        .db("careerguidancedb")
        .collection("assessmentResults");

      const assessmentDocument = {
        userId: new ObjectId(req.user.userId),
        score,
        total,
        percentage,
        answers: Array.isArray(answers) ? answers : [],
        categoryResults:
          categoryResults &&
          typeof categoryResults === "object"
            ? categoryResults
            : {},
        questions: Array.isArray(questions) ? questions : [],
        assessmentDate: date ? new Date(date) : new Date(),
        savedAt: new Date(),
      };

      const result = await assessmentCollection.insertOne(
        assessmentDocument
      );

      return res.status(201).json({
        success: true,
        message: "Assessment result saved successfully.",
        assessmentId: result.insertedId.toString(),
      });
    } catch (error) {
      console.error("Assessment save error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Server error while saving assessment result.",
      });
    }
  }
);

// ==========================================
// MONGODB CONNECTION AND SERVER STARTUP
// ==========================================

async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env file.");
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env file.");
    }

    await client.connect();

    await client.db("admin").command({
      ping: 1,
    });

    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `Backend running at http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Backend startup failed:",
      error.message
    );

    await client.close().catch(() => {});

    process.exit(1);
  }
}

startServer();
