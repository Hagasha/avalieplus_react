"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type NotificationType = "success" | "error" | "warning" | "info"

interface NotificationProps {
  type: NotificationType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

export function Notification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out",
        colors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start">
        <Icon className={cn("h-5 w-5 mt-0.5 mr-3 flex-shrink-0", iconColors[type])} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
        </div>
        <button onClick={handleClose} className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([])

  const addNotification = (notification: Omit<NotificationProps, "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = {
      ...notification,
      id,
      onClose: () => removeNotification(id),
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const success = (title: string, message?: string) => {
    addNotification({ type: "success", title, message })
  }

  const error = (title: string, message?: string) => {
    addNotification({ type: "error", title, message })
  }

  const warning = (title: string, message?: string) => {
    addNotification({ type: "warning", title, message })
  }

  const info = (title: string, message?: string) => {
    addNotification({ type: "info", title, message })
  }

  return {
    notifications,
    success,
    error,
    warning,
    info,
  }
}

// Componente para renderizar todas as notificações
export function NotificationContainer() {
  const { notifications } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  )
}
