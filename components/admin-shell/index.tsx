/**
 * The fixed-height scroll container the admin console and its login page sit
 * in. It lives here rather than in the root layout so the public landing page
 * can scroll the window, which its scroll-linked animations read.
 */
const AdminShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-screen overflow-hidden">
    <div className="scrollbar-thin scrollbar-thumb-gray-200 h-screen overflow-auto bg-neutral-white">
      {children}
    </div>
  </div>
)

export default AdminShell
