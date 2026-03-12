
import FemaleIcon from "../../assets/SVG/female";
import MaleIcon from "../../assets/SVG/male";
import ShinyStarIcon from "../../assets/SVG/star";
import classes from "./styles.module.css";

type GenderToggleProps = {
  gender: "male" | "female";
  onToggle: (g: "male" | "female") => void;
};

type ShinyToggleProps = {
  isShiny: boolean;
  onToggle: () => void;
};

const ShinyToggle = ({ isShiny, onToggle }: ShinyToggleProps) => {
  return (
    <button
      className={classes.s_toggleBtn}
      onClick={onToggle}
      aria-label="Toggle shiny"
    >
      <ShinyStarIcon
        className={classes.icon}
        fill={isShiny ? "gold" : "black"}
      />
    </button>
  );
};

const GenderToggle = ({ gender, onToggle }: GenderToggleProps) => {
  return (
    <div className={classes.genderToggle}>
      <button
        className={`${classes.genderBtn} ${
          gender === "male" ? classes.genderActive : ""
        }`}
        onClick={() => onToggle("male")}
        aria-label="Male"
      >
        <MaleIcon className={classes.icon} />
      </button>

      <button
        className={`${classes.genderBtn} ${
          gender === "female" ? classes.genderActive : ""
        }`}
        onClick={() => onToggle("female")}
        aria-label="Female"
      >
        <FemaleIcon className={classes.icon} />
      </button>
    </div>
  );
};

export { GenderToggle, ShinyToggle };
