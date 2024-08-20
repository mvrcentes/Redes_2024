import axios from "axios"
import FormData from "form-data"

export async function POST(req) {
  try {
    const formData = await req.formData() // Obtener el formData
    const file = formData.get("file") // Obtener el archivo

    console.log(file)

    const uploadForm = new FormData()
    uploadForm.append("files[]", file) // Usar "files[]" como clave, según la documentación

    const response = await axios.post("https://uguu.se/upload", uploadForm, {
      headers: {
        ...uploadForm.getHeaders(), // Incluir los encabezados correctos de FormData
      },
    })

    console.log(response)

    // Verifica si la respuesta contiene la URL del archivo subido
    const downloadUrl = response.data.files?.[0]?.url
    if (downloadUrl) {
      console.log("File uploaded successfully:", downloadUrl)
      return new Response(JSON.stringify({ url: downloadUrl }), { status: 200 })
    } else {
      throw new Error("File upload failed")
    }
  } catch (error) {
    console.error("Failed to upload file:", error)
    return new Response(JSON.stringify({ error: "Failed to upload file" }), {
      status: 500,
    })
  }
}
