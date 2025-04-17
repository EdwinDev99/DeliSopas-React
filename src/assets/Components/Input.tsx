import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Input({ children }: Props) {
  return (
    <div className="mb-3">
      <label htmlFor="exampleInputEmail1" className="form-label">
        {children}
      </label>
      <input
        type="number"
        className="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
      />
    </div>
  );
}

export default Input;
