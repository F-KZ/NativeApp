import React from "react";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

export default function Alert({ 
  error, 
  onClose, 
  title = "Erreur",
  duration = 3000,
  placement = 'top',
  variant = 'solid',
  action = 'error'
}) {
  const toast = useToast();
  const [toastId, setToastId] = React.useState(0);
  const prevErrorRef = React.useRef(error);

  React.useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      showNewToast();
      prevErrorRef.current = error;
    }
  }, [error]);

  const showNewToast = () => {
    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement,
        duration,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast 
              nativeID={uniqueToastId} 
              action={action}
              variant={variant}
              onClose={onClose}
            >
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>
                {error?.message || error}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return null;
}