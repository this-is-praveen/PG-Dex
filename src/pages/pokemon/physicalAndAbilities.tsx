import axios from "axios";
import { Fragment } from "react";
import { useQuery } from "react-query";
import {
  Ability,
  PokemonAbilityData,
  PokemonData,
  PokemonSpeciesData,
} from "../../assets/types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import classes from "./styles.module.css";
import { isEmpty } from "lodash";

const RenderAbility = ({ ability }: { ability: Ability }) => {
  const abilityName = ability.ability.name;
  const isHiddenAbility = ability.is_hidden;
  const id = `ability_${abilityName}`;
  const fetchUrl = ability.ability.url;
  const { data, error } = useQuery(id, () => axios.get(fetchUrl));

  if (error || !data) return <Fragment />;

  const abilityData: PokemonAbilityData = data.data;
  const abilityContent = abilityData.effect_entries.find(
    (effectObj) => effectObj.language.name === "en"
  );

  return (
    <Fragment>
      <li id={id} className="text-center">
        ⓘ {abilityName} {isHiddenAbility ? "(Hidden)" : ""}
      </li>
      <Tooltip
        anchorId={id}
        content={abilityContent?.effect}
        className="max-w-[90%] !text-[10px] font-['GB'] leading-5"
      />
    </Fragment>
  );
};

const Abilities = ({ abilities }: { abilities: Ability[] }) => {
  return (
    <div className="mb-3">
      <div className={`${classes["fontOr"]} text-2xl text-center mb-2`}>
        {abilities.length > 1 ? "Abilities" : "Ability"}
      </div>
      <ul className="flex flex-col justify-center">
        {abilities.map((ability) => (
          <RenderAbility key={ability.ability.name} ability={ability} />
        ))}
      </ul>
    </div>
  );
};

const PhysicalAndAbilities = ({
  pokemonData,
  speciesData,
}: {
  pokemonData: PokemonData;
  speciesData: PokemonSpeciesData;
}) => {
  const genderRateFromRes = speciesData.gender_rate;
  const genderRate =
    genderRateFromRes >= 0
      ? genderRateFromRes === 0
        ? [100, 0]
        : [100 - (genderRateFromRes / 8) * 100, (genderRateFromRes / 8) * 100]
      : [];
  const captureRate = speciesData.capture_rate;

  return (
    <div className={`${classes["desc_block"]} w-full`}>
      <Abilities abilities={pokemonData.abilities} />
      <div className={`text-2xl flex flex-col`}>
        <div className="flex flex-col text-center mb-3">
          <span className={`${classes["fontOr"]}`}>Height</span>
          <div>
            {pokemonData.height / 10}
            <span className="text-base ml-1">Meter</span>
          </div>
        </div>
        <div className="flex flex-col text-center mb-2">
          <span className={`${classes["fontOr"]}`}>Weight</span>
          <div>
            {pokemonData.weight / 10}
            <span className="text-base ml-1">Kilogram</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex w-5/12 flex-col">
            <span className={`${classes["fontOr"]}`}>Gender</span>
            {isEmpty(genderRate) ? (
              <span>Genderless</span>
            ) : (
              <div className="flex flex-col">
                <span className="text-base">Male {genderRate[0]}%</span>
                <span className="text-base">Female {genderRate[1]}%</span>
              </div>
            )}
          </div>
          <div className="flex w-7/12 flex-col">
            <span className={`text-end ${classes["fontOr"]}`}>Catch Rate</span>
            <span className="text-lg text-end">{captureRate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PhysicalAndAbilities;
