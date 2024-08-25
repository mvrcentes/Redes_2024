import React, { useRef } from "react"
import { Paperclip } from "lucide-react"

const InputFile = ({ onChange }) => {
  // Create a reference to the file input element
  const fileInputRef = useRef(null)

  // Handle button click to trigger the file input click event
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Open the file dialog
    }
  }

  // Handle file selection event
  const handleOnChange = (event) => {
    const file = event.target?.files?.[0] ?? undefined // Get the selected file (only the first one)
    if (onChange) {
      onChange(file) // Pass the selected file to the onChange callback
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Button to trigger file selection */}
      <button className="text-white rounded" onClick={handleButtonClick}>
        <Paperclip color="#898787" /> {/* Paperclip icon for file attachment */}
      </button>
      {/* Hidden file input element */}
      <input
        type="file"
        onChange={handleOnChange} // Handle file selection
        ref={fileInputRef} // Attach the ref to this input element
        className="hidden" // Hide the input element
      />
    </div>
  )
}

export default InputFile
