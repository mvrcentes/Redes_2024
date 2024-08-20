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

// Función para verificar si es una imagen
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

// Función para verificar si es un archivo de texto
const isTextFile = (url) => {
  return (
    typeof url === "string" &&
    (url.endsWith(".txt") || url.endsWith(".md") || url.endsWith(".json"))
  )
}

// Función para verificar si es un archivo descargable
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
  const handleDownload = (url) => {
    const link = document.createElement("a")
    link.href = url
    link.download = message.split("/").pop() // Nombre del archivo extraído de la URL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className={classNames({
        "flex flex-row gap-2 w-[50%]": true,
        "self-end flex-row-reverse": right,
      })}>
      <div
        className={classNames({
          "w-8 h-8 bg-gray-400 rounded-sm self-end text-center uppercase p-1": true,
          "flex-row-reverse": right,
        })}>
        {from[0]}
      </div>
      <div className="p-2 bg-[#eeeef8] rounded-md">
        {isImageUrl(message) ? (
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <FileText />
                <span>{message.split("/").pop()}</span>
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
          <Button
            variant="link"
            className="flex gap-2 items-center text-blue-500"
            onClick={() => handleDownload(message)}>
            <ArrowDownToLine />
            <span>{message.split("/").pop()}</span>
          </Button>
        ) : (
          <p className="w-full">{message}</p>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
