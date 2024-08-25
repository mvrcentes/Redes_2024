import React from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Textarea } from "@/components/ui/textarea"

import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { toast } from "@/components/ui/use-toast"
import { Check, ChevronsUpDown } from "lucide-react"

const RenderField = ({ field, props }) => {
  const {
    fieldType,
    fieldTypeType,
    iconSrc,
    iconAlt,
    placeholder,
    children,
    form,
    maxFiles,
    acceptedFiles,
    control,
  } = props

  const [fileStates, setFileStates] = React.useState([])

  function updateFileProgress(key, progress) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates)
      const fileState = newFileStates.find((fileState) => fileState.key === key)
      if (fileState) {
        fileState.progress = progress
      }
      return newFileStates
    })
  }

  switch (fieldType) {
    // Render an input field
    case "input":
      return (
        <div className="flex rounded-md border border-white bg-white">
          {/* Optional icon displayed before the input field */}
          {iconSrc && (
            <div className="flex items-center justify-center h-12 w-10 bg-white border-r border-white">
              <Image
                src={iconSrc}
                height={24}
                width={24}
                alt={iconAlt || "icon alt"}
                className="ml-2"
              />
            </div>
          )}
          <FormControl>
            <Input
              {...field}
              type={fieldTypeType || "text"} // Default to text input if no type is provided
              placeholder={placeholder}
              className="w-full shad-input"
            />
          </FormControl>
        </div>
      )

    // Render a number input field
    case "number":
      return (
        <div className="flex rounded-md border border-white bg-white">
          {iconSrc && (
            <div className="flex items-center justify-center h-12 w-10 bg-white border-r border-white">
              <Image
                src={iconSrc}
                height={24}
                width={24}
                alt={iconAlt || "icon alt"}
                className="ml-2"
              />
            </div>
          )}
          <FormControl>
            <Input
              {...field}
              type={"number"} // Input type is number
              placeholder={placeholder}
              className="w-full shad-input"
              onChange={(e) => {
                field.onChange(e.target.value) // Handle input changes
              }}
            />
          </FormControl>
        </div>
      )

    // Render a date picker field
    case "date":
      const [open, setOpen] = React.useState(false) // State to manage the popover open/close status
      return (
        <div className="h-12 flex rounded-md border border-white bg-white">
          <Popover open={open}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-full pl-3 text-left font-normal bg-transparent text-black",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => {
                    setOpen(!open)
                    console.log(open)
                  }}>
                  {field.value ? (
                    format(field.value, "PPP", { locale: es }) // Format date using `date-fns`
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date) // Update field value with selected date
                  setOpen(false) // Close the popover
                }}
                disabled={
                  (date) => date > new Date() || date < new Date("1900-01-01") // Disable dates outside of valid range
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )

    // Render a textarea input field
    case "textarea":
      return (
        <FormControl>
          <Textarea
            {...field}
            placeholder={placeholder}
            className="w-full shad-input"
          />
        </FormControl>
      )

    default:
      break
  }
}

const CustomFormField = (props) => {
  const { control, fieldType, name, label } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {/* Render label unless the field type is checkbox */}
          {fieldType !== "checkbox" && label && (
            <FormLabel> {label} </FormLabel>
          )}
          {/* Render the appropriate field based on the field type */}
          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />{" "}
          {/* Display form error message */}
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
