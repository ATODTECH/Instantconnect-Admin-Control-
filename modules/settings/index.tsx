"use client"
import { useState } from "react"
import { UnavailableSettings } from "@/components/form/settings-fields"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import GeneralSettings from "./general";
import NotificationSettings from "./notifications";
import SecuritySettings from "./security";
import PaymentSettings from "./payment";
import ContentModerationSettings from "./content-moderation";

const TABS: readonly FilterTab<TabId>[] = [
  { value: "general", label: "General" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
  { value: "payment", label: "Payment" },
  { value: "content-moderation", label: "Content Moderation" },
]

const SettingsHomeIndex = () => {
  const [activeTab, setActiveTab] = useState<TabId>("general")


  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="flex flex-col gap-y-6 mb-8">
        {/* Tabs row */}
        <div className="flex bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <FilterTabs label="Settings sections" tabs={TABS} value={activeTab} onChange={setActiveTab} />
        </div>
        <div>
          {(activeTab==="general") && 
          (<GeneralSettings />)}
          {(activeTab==="notifications") && 
          (<UnavailableSettings><NotificationSettings /></UnavailableSettings>)}
          {(activeTab==="security") && 
          (<UnavailableSettings><SecuritySettings /></UnavailableSettings>)}
          {(activeTab==="payment") && 
          (<UnavailableSettings><PaymentSettings /></UnavailableSettings>)}
          {(activeTab==="content-moderation") && 
          (<UnavailableSettings><ContentModerationSettings /></UnavailableSettings>)}
        </div>
      </div>
    </div>
  )
}

export default SettingsHomeIndex