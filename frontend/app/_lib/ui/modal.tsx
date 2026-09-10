
interface ModalProps {
  modal: (val: boolean) => void;
  content: React.ReactNode[];
}

const ModalIndex = ({modal, content}: ModalProps) => {
  return (
    <div>ModalIndex</div>
  )
}

export default ModalIndex