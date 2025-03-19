import React from "react";
import { getRecentActivity } from "@/services/dashboardService";

const RecentActivityList = async () => {
  const activities = await getRecentActivity();

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center">No recent activities</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 pb-4 border-b border-gray-100"
          >
            <div
              className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === "user"
                  ? "bg-blue-100 text-blue-600"
                  : activity.type === "system"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-green-100 text-green-600"
              }`}
            >
              {activity.type === "user"
                ? "👤"
                : activity.type === "system"
                  ? "🔧"
                  : "📝"}
            </div>
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentActivityList;
