import axios from "axios";
import { isEmpty, startCase } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useQuery } from "react-query";
import {
  Chain,
  PokemonData,
  PokemonEvolution,
  PokemonSpeciesData,
  Species,
} from "../../assets/types";
import { APIBasePath } from "../../utils";
import PokeballLoader from "../../assets/pokeball.gif";
import classes from "./styles.module.css";
import { Fragment } from "react";
import Arrow from "../../components/Arrow";
import { Navigate, useNavigate } from "react-router-dom";

const CurrentEvolution = ({ chain }: { chain: Chain }) => {
  const currentSpecies = chain.species;
  const pokemonId = currentSpecies.url.split("/").at(-2);
  const { data: { data: data1 } = {}, isLoading: pokemonDataLoading } =
    useQuery(`species_${pokemonId}`, () => axios.get(currentSpecies.url));
  const { data: { data: data2 } = {}, isLoading: speciesDataLoading } =
    useQuery(`pokemon_${pokemonId}`, () =>
      axios.get(`${APIBasePath}/pokemon/${pokemonId}`)
    );

  const navigate = useNavigate();
  const speciesData = data1 as Species;
  const pokemonData = data2 as PokemonData;

  if (pokemonDataLoading || speciesDataLoading) {
    return <>Loading</>;
  }
  const nextEvolutionChain = chain.evolves_to[0];
  const hasConsecutiveEvolution = !isEmpty(nextEvolutionChain);

  const evolutionDetail = hasConsecutiveEvolution
    ? nextEvolutionChain.evolution_details[0]
    : undefined;
  console.log("evolutionDetail :>> ", chain, evolutionDetail);
  const evolutionBy = !!evolutionDetail
    ? startCase(evolutionDetail.trigger.name)
    : "";
  const evolutionByValue = !!evolutionDetail
    ? startCase(
        Object.values(evolutionDetail).filter(Boolean)?.[0]?.name ||
          Object.values(evolutionDetail).filter(Boolean)?.[0]
      )
    : "";

  const EvolutionText = (
    <div className="flex flex-col">
      <span className="whitespace-nowrap">{evolutionBy}</span>
      <span className="whitespace-nowrap">{evolutionByValue}</span>
    </div>
  );

  return (
    <Fragment>
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
            height={200}
            effect={"blur"}
            onClick={() => navigate(`/pokemon/${pokemonId}`)}
            placeholderSrc={PokeballLoader}
          />
        </div>
        <div className="flex gap-3">
          <span># {pokemonData.id}</span>
          <span>{startCase(pokemonData.name)}</span>
        </div>
      </div>
      {hasConsecutiveEvolution && (
        <Fragment>
          <Arrow
            position="right"
            text={!!evolutionDetail ? EvolutionText : ""}
          />
          <CurrentEvolution chain={nextEvolutionChain} />
        </Fragment>
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

  const {
    data: { data } = {},
    isLoading,
    isError,
  } = useQuery(`evolution_chain_${evolutionChainId}`, fetchData);

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
      <div className={`flex justify-evenly`}>
        <CurrentEvolution chain={chain} />
      </div>
    </div>
  );
};

export default EvolutionChart;
