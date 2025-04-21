import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  children: ReactNode;
  name: string;
};

function Input({ children, name }: Props) {
  const { register } = useFormContext();
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {children}
      </label>
      <input {...register(name)} type="number" className="form-control" />
    </div>
  );
}

export default Input;
