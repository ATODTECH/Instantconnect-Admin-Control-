"use client"

interface ModalProps {
  modal: (val: boolean) => void;
  content: React.ReactNode;
}

const ModalIndex = ({modal, content}: ModalProps) => {
  const closeOutterModal = () => modal(false);

  return (
    <div role='button' className="flex absolute z-20 h-screen w-full bg-[#00000080] " onClick={closeOutterModal}>
      {content}
    </div>
  )
}

export default ModalIndex