"use client"

import React from "react"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, Form } from "react-hook-form"
import Image from "next/image"
import { FormFieldType } from "@/lib/types"
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { ComboXSelect } from "@/lib/types"
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
import { MultiFileDropzone, type FileState } from "./FileDropZone"
import { DropzoneOptions } from "react-dropzone"

interface CustomFormFieldProps {
  control: Control<any>
  fieldType: FormFieldType
  fieldTypeType?: string
  maxFiles?: number
  acceptedFiles?: Object
  name: string
  // fieldValues?: ComboXSelect[]
  label?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormats?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  form?: any
  renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({
  field,
  props,
}: {
  field: any
  props: CustomFormFieldProps
}) => {
  const {
    fieldType,
    fieldTypeType,
    iconSrc,
    iconAlt,
    placeholder,
    children,
    // fieldValues,
    form,
    maxFiles,
    acceptedFiles,
    control,
  } = props

  const [fileStates, setFileStates] = React.useState<FileState[]>([])

  function updateFileProgress(key: string, progress: FileState["progress"]) {
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
    case FormFieldType.INPUT:
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
              type={fieldTypeType || "text"}
              placeholder={placeholder}
              // defaultValue={control._defaultValues[field.name]}
              className="w-full shad-input"
              // onChange={(e) => {
              //   field.onChange(e.target.value)
              // }}
            />
          </FormControl>
        </div>
      )
    case FormFieldType.NUMBER:
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
              type={"number"}
              placeholder={placeholder}
              className="w-full shad-input"
              onChange={(e) => {
                field.onChange(e.target.value)
              }}
            />
          </FormControl>
        </div>
      )
    // TODO: Add support for file type
    // TODO: review the implementation of the file type
    // TODO: review if there's a better way to implemnt it
    case FormFieldType.FILE:
      return (
        <div className="flex flex-col items-center">
          <MultiFileDropzone
            value={fileStates}
            dropzoneOptions={
              {
                maxFiles: maxFiles,
                maxSize: 1024 * 1024 * 1, // 1 MB
              } as DropzoneOptions
            }
            onChange={(fileStates) => {
              setFileStates(fileStates)
            }}
            onFilesAdded={async (addedFiles) => {
              setFileStates([...fileStates, ...addedFiles])

              addedFiles.map((addedFileState) => {
                form.setValue("file", addedFileState.file)
              })
            }}
            accept={acceptedFiles}
          />
        </div>
      )
    case FormFieldType.DATE:
      const [open, setOpen] = React.useState(false)
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
                    format(field.value, "PPP", { locale: es })
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
                  field.onChange(date)
                  setOpen(false)
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            {...field}
            placeholder={placeholder}
            className="w-full shad-input"
          />
        </FormControl>
      )
    // case FormFieldType.SELECT:
    //   return (
    //     <Select onValueChange={field.onChange} defaultValue={field.value}>
    //       <FormControl className="h-12">
    //         <SelectTrigger>
    //           <SelectValue placeholder={placeholder} />
    //         </SelectTrigger>
    //       </FormControl>
    //       <SelectContent>{children}</SelectContent>
    //     </Select>
    //   )
    // case FormFieldType.SELECT_ITEM:
    //   const [openSelectItem, setOpenSelectItem] = React.useState(false)
    //   return (
    //     <Popover open={openSelectItem} onOpenChange={setOpenSelectItem}>
    //       <PopoverTrigger asChild>
    //         <FormControl>
    //           <Button
    //             variant="outline"
    //             role="combobox"
    //             className={cn(
    //               "w-full h-[48px] justify-between",
    //               !field.value && "text-muted-foreground"
    //             )}>
    //             {field.value
    //               ? fieldValues!.find(
    //                   (fieldValue) => fieldValue.value === field.value
    //                 )?.label
    //               : placeholder}
    //             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //           </Button>
    //         </FormControl>
    //       </PopoverTrigger>
    //       <PopoverContent className="w-[200px] p-0">
    //         <Command>
    //           <CommandInput placeholder="Search language..." />
    //           <CommandList>
    //             <CommandEmpty>No language found.</CommandEmpty>
    //             <CommandGroup>
    //               {fieldValues!.map((fieldValue) => (
    //                 <CommandItem
    //                   value={fieldValue.label}
    //                   key={fieldValue.value}
    //                   onSelect={() => {
    //                     form.setValue("property_identifier", fieldValue.value)
    //                     setOpenSelectItem(false)
    //                   }}>
    //                   <Check
    //                     className={cn(
    //                       "mr-2 h-4 w-4",
    //                       fieldValue.value === field.value
    //                         ? "opacity-100"
    //                         : "opacity-0"
    //                     )}
    //                   />
    //                   {fieldValue.label}
    //                 </CommandItem>
    //               ))}
    //             </CommandGroup>
    //           </CommandList>
    //         </Command>
    //       </PopoverContent>
    //     </Popover>
    //   )
    default:
      break
  }
}

const CustomFormField = (props: CustomFormFieldProps) => {
  const { control, fieldType, name, label } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel> {label} </FormLabel>
          )}

          <RenderField field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
