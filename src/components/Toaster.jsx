import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      position="top-center"
      className="toaster group"
      {...props}
    />
  );
};

export default Toaster;
