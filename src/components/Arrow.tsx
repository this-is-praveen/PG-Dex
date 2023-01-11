import classes from "./styles.module.css";

const positionClass = {
  top: "rotate-45",
  right: "-rotate-90",
  bottom: "rotate-0",
  left: "rotate-90",
};

type positionType = keyof typeof positionClass;

const Arrow = ({
  text,
  position,
}: {
  text: JSX.Element | string;
  position: positionType;
}) => {
  return (
    <div className="relative">
      <div className={classes["arrow_content"]}>
        <div className="text-center my-3">{text}</div>
        <svg className={`${classes["arrow"]} ${positionClass[position]}`}>
          <polygon
            className={classes["arrow-top"]}
            points="37.6,27.9 1.8,1.3 3.3,0 37.6,25.3 71.9,0 73.7,1.3 "
          />
          <polygon
            className={classes["arrow-middle"]}
            points="37.6,45.8 0.8,18.7 4.4,16.4 37.6,41.2 71.2,16.4 74.5,18.7 "
          />
          <polygon
            className={classes["arrow-bottom"]}
            points="37.6,64 0,36.1 5.1,32.8 37.6,56.8 70.4,32.8 75.5,36.1 "
          />
        </svg>
      </div>
    </div>
  );
};

export default Arrow;
