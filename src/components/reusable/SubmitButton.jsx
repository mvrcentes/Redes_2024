import { Button } from "@/components/ui/button"
import Image from "next/image"
import React from "react"

import loader from "@/app/assets/icons/loader.svg"

export const SubmitButton = ({ isLoading, className, children }) => {
  return (
    <Button
      type="submit"
      className={className ?? "shad-primary-btn w-full"} // Use provided className or default styling
      disabled={isLoading} // Disable the button when loading
    >
      {isLoading ? (
        // Show loading state with spinner
        <div className="flex items-center gap-4">
          <Image
            src={loader}
            alt="loader"
            width={24}
            height={24}
            className="animate-spin" // Spinner animation for loading state
          />
          Cargando ... {/* Loading text */}
        </div>
      ) : (
        // Show the button's children (typically its label)
        children
      )}
    </Button>
  )
}
