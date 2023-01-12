import axios from "axios";
import { isEmpty, isEqual, startCase } from "lodash";
import { Fragment } from "react";
import { isMobile } from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import PokeballLoader from "../../assets/pokeball.gif";
import {
  Chain,
  EvolutionDetail,
  PokemonData,
  PokemonEvolution,
  PokemonSpeciesData,
} from "../../assets/types";
import Arrow, { PositionType } from "../../components/Arrow";
import { APIBasePath } from "../../utils";
import classes from "./styles.module.css";

const EvolveLabel = ({ by, value }: { by: string; value: string }) => {
  return (
    <div className="flex flex-col">
      <span className="whitespace-nowrap">{by}</span>
      <span className="whitespace-nowrap">{value}</span>
    </div>
  );
};

const arrowPositionBy: { [key: string]: PositionType[] } = {
  "1": ["right"] as PositionType[],
  "2": ["topRight", "bottomRight"],
  "3": ["topRight", "right", "bottomRight"],
};

const NextOrParallelPokemon = ({
  text,
  chain,
  arrowPosition = "right" as PositionType,
}: {
  text: JSX.Element | string;
  chain: Chain;
  arrowPosition?: PositionType;
}) => {
  return (
    <Fragment>
      <Arrow position={isMobile ? "bottom" : arrowPosition} text={text} />
      <CurrentEvolution chain={chain} />
    </Fragment>
  );
};

const CurrentEvolution = ({ chain }: { chain: Chain }) => {
  const currentSpecies = chain.species;
  const pokemonId = currentSpecies.url.split("/").at(-2);

  const { data: { data: data2 } = {}, isLoading: speciesDataLoading } =
    useQuery(`pokemon_${pokemonId}`, () =>
      axios.get(`${APIBasePath}/pokemon/${pokemonId}`)
    );

  const navigate = useNavigate();
  const pokemonData = data2 as PokemonData;

  if (speciesDataLoading) {
    return <>Loading</>;
  }
  const nextEvolutionChain = chain.evolves_to;
  const hasConsecutiveEvolution = !isEmpty(nextEvolutionChain);

  const evolutionDetail = hasConsecutiveEvolution
    ? nextEvolutionChain.map((currentChain) => {
        const validRequirementsItem = currentChain.evolution_details
          .filter((detail) => !isEmpty(Object.values(detail).filter(Boolean)))
          .at(-1);
        const baseEvolutionRequirementsIndex =
          currentChain.evolution_details.findIndex((item) =>
            isEqual(item, validRequirementsItem)
          ) || 0;

        return currentChain.evolution_details[baseEvolutionRequirementsIndex];
      })
    : undefined;
  const evolutionBy = !!evolutionDetail
    ? evolutionDetail.map((detail) => startCase(detail.trigger.name))
    : [];
  const evolutionByValue = !!evolutionDetail
    ? evolutionDetail.map((detail) => {
        const baseEvolutionRequirements = Object.values(detail).filter(
          Boolean
        )?.[0] as any;

        const val = startCase(
          baseEvolutionRequirements?.name ||
            baseEvolutionRequirements?.item?.name ||
            baseEvolutionRequirements
        );
        const isValueAsNumber = isFinite(+val);
        type detailKey = keyof EvolutionDetail;

        const valPrefix = isValueAsNumber
          ? startCase(
              Object.keys(detail).find((key) =>
                isEqual(detail[key as detailKey], baseEvolutionRequirements)
              )
            )
          : "";

        return `${valPrefix} ${val}`;
      })
    : [];

  return (
    <Fragment>
      <div className="flex flex-col justify-center items-center grow-[1]">
        <div>
          <div className="m-2 group">
            <LazyLoadImage
              className="h-48 hover:cursor-pointer group-hover:motion-safe:animate-bounce"
              src={
                pokemonData.sprites.other.dream_world.front_default ||
                pokemonData.sprites.other["official-artwork"].front_default
              }
              width={"auto"}
              alt={pokemonData.name}
              height={isMobile ? "auto" : 200}
              effect={"blur"}
              onClick={() => navigate(`/pokemon/${pokemonId}`)}
              placeholderSrc={PokeballLoader}
            />
          </div>
          <div className="flex gap-3 justify-center">
            <span># {pokemonData.id}</span>
            <span>{startCase(pokemonData.name)}</span>
          </div>
        </div>
      </div>
      {nextEvolutionChain?.length > 1 && (
        <div className="flex flex-col justify-center items-center grow-[2]">
          {nextEvolutionChain.length &&
            nextEvolutionChain.map((nextChain, index) => {
              return (
                <div className="flex w-full">
                  <NextOrParallelPokemon
                    text={
                      evolutionDetail && !!evolutionDetail[index] ? (
                        <EvolveLabel
                          by={evolutionBy[index]}
                          value={evolutionByValue[index]}
                        />
                      ) : (
                        ""
                      )
                    }
                    arrowPosition={
                      arrowPositionBy[nextEvolutionChain.length]?.[index] ||
                      "right"
                    }
                    chain={nextChain}
                  />
                </div>
              );
            })}
        </div>
      )}
      {nextEvolutionChain.length === 1 && (
        <NextOrParallelPokemon
          text={
            evolutionDetail && !!evolutionDetail[0] ? (
              <EvolveLabel by={evolutionBy[0]} value={evolutionByValue[0]} />
            ) : (
              ""
            )
          }
          chain={nextEvolutionChain[0]}
        />
      )}
    </Fragment>
  );
};

const EvolutionChart = ({
  speciesData,
}: {
  speciesData: PokemonSpeciesData;
}) => {
  const evolutionChainUrl = speciesData.evolution_chain?.url || "";
  const evolutionChainId = evolutionChainUrl.split("/").at(-2);

  const fetchData = ({}) => {
    return axios.get(evolutionChainUrl);
  };

  const { data: { data } = {}, isLoading } = useQuery(
    `evolution_chain_${evolutionChainId}`,
    fetchData
  );

  if (isLoading) {
    return <>Loading</>;
  }

  const evolutionData = data as PokemonEvolution;
  const noEvolution = isEmpty(evolutionData.chain.evolves_to);

  if (noEvolution) {
    return <div>{speciesData.name} does not evolve</div>;
  }
  const chain = evolutionData.chain;

  return (
    <div className={`flex ${classes["detail_card"]} my-8 mx-6 flex-col`}>
      <div className="font-['PokemonOR'] text-3xl text-center">Evolutions</div>
      <div className={`flex flex-col md:flex-row justify-evenly`}>
        <CurrentEvolution chain={chain} />
      </div>
    </div>
  );
};

export default EvolutionChart;
