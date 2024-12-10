// components/ui/use-toast.tsx
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const toastStore = {
  toasts: [] as ToasterToast[],
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  },
  notify() {
    this.listeners.forEach((listener) => listener())
  },
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).slice(2)
  const toast: ToasterToast = { ...props, id }
  toastStore.toasts.push(toast)
  toastStore.notify()
  return toast
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  React.useEffect(() => {
    return toastStore.subscribe(() => {
      setToasts([...toastStore.toasts])
    })
  }, [])

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      toastStore.toasts = toastId
        ? toastStore.toasts.filter((t) => t.id !== toastId)
        : []
      toastStore.notify()
    },
  }
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose onClick={() => dismiss(id)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}