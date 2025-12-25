import { requireAuth, clerkClient } from "@clerk/express";

export const auth = [
  requireAuth(), // ✅ verifies JWT & attaches req.auth
  async (req, res, next) => {
    try {
      const { userId, has } = await req.auth();

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // ✅ Correct way to check Clerk Billing plan
      const isPremium = await has({ plan: "premium" });

      req.userId = userId;
      req.plan = isPremium ? "premium" : "free";

      // ✅ Only track free usage for FREE users
      if (!isPremium) {
        const user = await clerkClient.users.getUser(userId);
        req.free_usage = user.privateMetadata?.free_usage ?? 0;
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  },
];
