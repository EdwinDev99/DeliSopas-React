import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  children: ReactNode;
  mesa?: string;
};

function Input({ children, mesa }: Props) {
  const { register } = useFormContext();
  return (
    <div className="mb-3">
      <label htmlFor={mesa} className="form-label">
        {children}
      </label>
      <input
        {...register("mesa")}
        type="number"
        className="form-control"
        id={mesa}
        aria-describedby="emailHelp"
      />
    </div>
  );
}

export default Input;
