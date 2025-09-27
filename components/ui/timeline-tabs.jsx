"use client";

import { cn } from "@/lib/utils";

const TimelineTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "months", description: "4 months" },
    { id: "weeks", description: "4 weeks" },
    { id: "days", description: "7 days" },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1 w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
            activeTab === tab.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <div className="text-center">
            <div className="text-xs text-gray-500">{tab.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TimelineTabs;
