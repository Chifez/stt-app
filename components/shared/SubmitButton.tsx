import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

const SubmitButton = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {label}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
