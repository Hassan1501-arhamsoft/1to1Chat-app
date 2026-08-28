import cron from "node-cron";
import { Op } from "sequelize";
import User from "../models/user.model.js";

const startCronJobs = () => {
  // "0 0 * * *" means the job runs every day at exactly midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("🧹 Running daily cleanup of unverified accounts...");
    
    try {
      // Calculate the exact time 24 hours ago
      const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

      // Delete users matching the criteria
      const deletedCount = await User.destroy({
        where: {
          isVerified: false,
          createdAt: {
            [Op.lt]: twentyFourHoursAgo,
          },
        },
      });

      console.log(`✅ Cleanup complete: Removed ${deletedCount} unverified user(s).`);
    } catch (error) {
      console.error("❌ Error during cleanup cron job:", error);
    }
  });
};

export default startCronJobs;