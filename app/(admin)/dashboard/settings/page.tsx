import SettingsHomeIndex from '@/modules/settings'
import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "Platform Settings - InstantConnect",
  description: "Configure and manage platform preferences.",
}

const Settings: NextPage = () => {

  return (
    <>
      <SettingsHomeIndex />
    </>
  )
}

export default Settings