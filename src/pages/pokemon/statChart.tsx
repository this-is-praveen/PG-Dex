import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { PokemonStatColors, PokemonStatLabels } from "../../assets/globals";
import { PokemonStatColorKey } from "../../assets/types";
import classes from "./styles.module.css";

const StatChart = (props: { stats: any[] }) => {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );
  if (true) {
    const statValue: number[] = props.stats.map((s) => s.base_stat);
    const bestStat = Math.max(...statValue);
    const baseState = statValue.reduce((acc, stat) => acc + stat);
    const maximumLimit = bestStat > 150 ? bestStat + 20 : 150;
    const statColor = (obj: any) => {
      const index: 0 | 1 | 2 | 3 | 4 | 5 = obj.dataIndex || obj.index;
      const statKeys: any[] = Object.keys(PokemonStatLabels);
      const statName: PokemonStatColorKey = statKeys[index];
      const statColor = PokemonStatColors[statName];

      return statColor;
    };

    return (
      <div className={`${classes["desc_block"]}`}>
        <div
          className={`${classes["fontOr"]} flex uppercase text-2xl justify-center`}
        >
          Base stats -{" "}
          <span className="font-['PokemonSolid'] items-baseline	 tracking-widest">
            {baseState}
          </span>
        </div>
        <LazyLoadComponent>
          <Radar
            data={{
              labels: Object.values(PokemonStatLabels).map((label, index) => [
                label,
                props.stats[index].base_stat,
              ]),
              datasets: [
                {
                  data: props.stats.map((s) => s.base_stat),
                  pointBackgroundColor: statColor,
                  pointBorderColor: "rgb(0, 0, 0)",
                  borderColor: "rgb(0, 0, 0)",
                  showLine: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { display: false } },
              scales: {
                r: {
                  min: 0,
                  suggestedMax: maximumLimit,
                  pointLabels: {
                    color: "#000",
                    font: { family: "PokemonSolid", size: 14, weight: "400" },
                  },
                  grid: { color: "rgba(0, 0, 0, 0.1)" },
                  animate: true,
                  ticks: {
                    display: false,
                    stepSize: 50,
                    showLabelBackdrop: false,
                  },
                },
              },
            }}
          />
        </LazyLoadComponent>
      </div>
    );
  }
};

export default StatChart;
