import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import hirerRoutes from "./routes/hirer.routes";
import vendorRoutes from "./routes/vendor.routes";
import venueRoutes from "./routes/venue.routes";
import venueApplicationRoutes from "./routes/venueApplication.routes";
import venueBlockedPeriodRoutes from "./routes/venueBlockedPeriod.routes";
import venuePreferenceRoutes from "./routes/venuePreferences.routes";
import venueHirerStatsRouter from "./routes/venueHirerStats.routes";

const app = express(); 
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", hirerRoutes);
app.use("/api", vendorRoutes);
app.use("/api", venueRoutes);
app.use("/api", venueApplicationRoutes);
app.use("/api", venueBlockedPeriodRoutes);
app.use("/api", venuePreferenceRoutes);
app.use("/api", userRoutes);
app.use("/api", venueHirerStatsRouter);

AppDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );