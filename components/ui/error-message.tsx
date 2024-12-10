interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
      <p>{message}</p>
    </div>
  );
}