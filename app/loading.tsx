import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className={'flex justify-center items-center w-screen h-screen bg-neutral-white'}>
      <Loader2 size={40} strokeWidth={2} className="w-10 h-10 text-purple-light-600 animate-spin" />
    </div>
  )
}

export default Loading