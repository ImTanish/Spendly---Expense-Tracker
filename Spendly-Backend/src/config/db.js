const mongoose = require("mongoose");
const dns = require("dns");

// Some ISPs/routers don't resolve MongoDB's SRV DNS records correctly,
// even when the system DNS is set to a public resolver. Forcing Node's
// own DNS lookups to use public resolvers directly fixes the very common
// "querySrv ECONNREFUSED" error on such networks.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "MONGO_URI is not set. Add it to your .env file (see .env.example)."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;