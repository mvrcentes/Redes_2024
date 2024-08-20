import React, { useRef } from "react"
import { Paperclip } from "lucide-react"

const InputFile = ({ onChange }) => {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleOnChange = (event) => {
    const file = event.target?.files?.[0] ?? undefined
    if (onChange) {
      onChange(file)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button className="text-white rounded" onClick={handleButtonClick}>
        <Paperclip color="#898787" />
      </button>
      <input
        type="file"
        onChange={handleOnChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  )
}

export default InputFile
