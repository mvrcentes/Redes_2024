import axios from "axios"
import FormData from "form-data"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    // Obtener el formData desde la solicitud
    const formData = await req.formData()
    const file = formData.get("file") // Obtener el archivo del formData

    // Validar que el archivo existe
    if (!file) {
      throw new Error("No file provided")
    }

    console.log("File received on server:", file)

    // Crear un FormData para enviar a tmpfiles.org
    const uploadForm = new FormData()
    uploadForm.append("file", file)

    // Enviar la solicitud de subida a tmpfiles.org
    const response = await axios.post(
      "https://tmpfiles.org/api/v1/upload",
      uploadForm,
      {
        headers: {
          "accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": `multipart/form-data; boundary=${uploadForm._boundary}`,
          // ...uploadForm.getHeaders(), // Incluir los encabezados correctos de FormData
        },
      }
    )

    console.log("Response from tmpfiles.org:", response.data)

    // Verificar si la respuesta contiene la URL del archivo subido
    const downloadUrl = response.data.data?.url
    if (downloadUrl) {
      console.log("File uploaded successfully:", downloadUrl)
      return NextResponse.json({ url: downloadUrl }, { status: 200 })
    } else {
      throw new Error("File upload failed")
    }
  } catch (error) {
    console.error("Failed to upload file:", error.message)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
