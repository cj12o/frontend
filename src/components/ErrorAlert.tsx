import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertDestructive({title, desc}:{title:string, desc:string}) {
  return (
    <Alert variant="destructive" className="max-w-md backdrop-blur-4xl bg-black/5 text-md">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="font-semibold">
       {desc}
      </AlertDescription>
    </Alert>
  )
}


export default AlertDestructive