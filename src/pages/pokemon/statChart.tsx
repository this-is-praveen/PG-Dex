import { useState } from "react";
// import { PieChart } from "react-minimal-pie-chart";
// import { BaseDataEntry } from "react-minimal-pie-chart/types/commonTypes";
import { PokemonStatColors, PokemonStatLabels } from "../../assets/globals";
import { PokemonStatColorKey } from "../../assets/types";
// import "react-tooltip/dist/react-tooltip.css";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
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
          Base stats - {baseState}
        </div>
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
                  font: { size: 14, weight: "semi-bold" },
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
      </div>
    );
  }
};

export default StatChart;
