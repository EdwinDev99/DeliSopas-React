import BreakfastForm from "./BreakfastForm";
import LounchForm from "./LounchForm";

type Props = {};

function Restaurant({}: Props) {
  return (
    <div className="container">
      {/* <LounchForm /> */}
      <BreakfastForm />
    </div>
  );
}

export default Restaurant;
