"use client"
import { useState } from "react"
import GeneralSettings from "./general";
import NotificationSettings from "./notifications";

const TABS: { 
  id: TabId; 
  label: string 
}[] = [
  { id: "general", label: "General" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "payment", label: "Payment" },
  { id: "content-moderation", label: "Content Moderation" },
]

const SettingsHomeIndex = () => {
  const [activeTab, setActiveTab] = useState<TabId>("general")

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="flex flex-col gap-y-6 mb-8">
        {/* Tabs row */}
        <div className="flex bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <div className="flex items-center gap-1 rounded-lg bg-[#F4F3F5] p-1">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-neutral-light-600 shadow-sm font-semibold"
                    : "text-neutral-light-400 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          {(activeTab==="general") && 
          (<GeneralSettings />)}
          {(activeTab==="notifications") && 
          (<NotificationSettings />)}
        </div>
      </div>
    </div>
  )
}

export default SettingsHomeIndex