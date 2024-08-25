import React from "react"
import { ArrowDownToLine, FileText } from "lucide-react"
import classNames from "classnames"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Function to check if the URL is an image
const isImageUrl = (url) => {
  return (
    typeof url === "string" &&
    (url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".gif") ||
      url.endsWith(".webp"))
  )
}

// Function to check if the URL is a text file
const isTextFile = (url) => {
  return (
    typeof url === "string" &&
    (url.endsWith(".txt") || url.endsWith(".md") || url.endsWith(".json"))
  )
}

// Function to check if the URL is a downloadable file
const isDownloadableFile = (url) => {
  return (
    typeof url === "string" &&
    (url.endsWith(".pdf") ||
      url.endsWith(".docx") ||
      url.endsWith(".xlsx") ||
      url.endsWith(".zip") ||
      url.endsWith(".rar"))
  )
}

const ChatMessage = ({ message, from, right }) => {
  // Function to handle file download
  const handleDownload = (url) => {
    const link = document.createElement("a")
    link.href = url
    link.download = message.split("/").pop() // Extract the file name from the URL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className={classNames({
        "flex flex-row gap-2 w-[50%]": true, // Default styles for the message container
        "self-end flex-row-reverse": right, // Adjust alignment if the message is from the right side
      })}>
      <div
        className={classNames({
          "w-8 h-8 bg-gray-400 rounded-sm self-end text-center uppercase p-1": true, // Default styles for the avatar
          "flex-row-reverse": right, // Adjust alignment for the avatar if the message is from the right side
        })}>
        {from[0]} {/* Display the first character of the sender's name */}
      </div>
      <div className="p-2 bg-[#eeeef8] rounded-md">
        {isImageUrl(message) ? (
          // If the message is an image URL, render the image
          <div className="w-full h-full">
            <Image
              src={message}
              alt="Image"
              layout="responsive"
              objectFit="contain"
              className="rounded-md"
              width={1000}
              height={1000}
            />
          </div>
        ) : isTextFile(message) ? (
          // If the message is a text file URL, render a preview with a download option
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <FileText />
                <span>{message.split("/").pop()}</span>{" "}
                {/* Display the file name */}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>File Preview</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <iframe
                  src={message}
                  className="w-full h-64"
                  title="File Preview"
                />
              </div>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => handleDownload(message)}>
                <ArrowDownToLine className="mr-2" />
                Download File
              </Button>
            </DialogContent>
          </Dialog>
        ) : isDownloadableFile(message) ? (
          // If the message is a downloadable file URL, render a download button
          <Button
            variant="link"
            className="flex gap-2 items-center text-blue-500"
            onClick={() => handleDownload(message)}>
            <ArrowDownToLine />
            <span>{message.split("/").pop()}</span>{" "}
            {/* Display the file name */}
          </Button>
        ) : (
          // If the message is plain text, display it directly
          <p className="w-full">{message}</p>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
