import axios from "axios";
import { isEmpty, startCase } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { PokemonTypeColors } from "../../assets/globals";
import PokeballLoader from "../../assets/pokeball.gif";
import {
  PokemonData,
  PokemonSpeciesData,
  PokemonTypeColorKey,
} from "../../assets/types";
import ErrorPage from "../../components/ErrorPage";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { APIBasePath } from "../../utils";
import PokemonDescription from "./description";
import EvolutionChart from "./evolutionChart";
import PhysicalAndAbilities from "./physicalAndAbilities";
import StatChart from "./statChart";
import classes from "./styles.module.css";

const ImageComponent = ({ pokeData }: { pokeData: PokemonData }) => {
  const [isShiny, setIsShiny] = useState(false);
  const imageUrl =
    pokeData.sprites.other.home[isShiny ? "front_shiny" : "front_default"];

  return (
    <Fragment>
      <div
        className={`flex justify-end ${
          classes[isShiny ? "starOn" : "starOff"]
        }`}
      >
        <svg
          className={classes["star_icon"]}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          onClick={() => setIsShiny((prevState) => !prevState)}
        >
          <polygon points="12,3 6,21 21,9 3,9 18,21" />
        </svg>
      </div>
      {!!imageUrl ? (
        <LazyLoadImage
          className={"m-auto"}
          src={
            pokeData.sprites.other.home[
              isShiny ? "front_shiny" : "front_default"
            ]
          }
          width={isMobile ? "100%" : "90%"}
          alt={pokeData.name}
          effect={"blur"}
          placeholderSrc={PokeballLoader}
        />
      ) : (
        <div className="text-9xl h-full items-center flex justify-center font-['gb']">
          ?
        </div>
      )}
    </Fragment>
  );
};

const BackgroundImage = ({ imageUrl }: { imageUrl: string }) => {
  // const FastAverageColor = lazy(() => import("fast-average-color"));

  return (
    <div className={classes["pokemon_backgroundimage"]}>
      <LazyLoadImage
        className={"m-auto"}
        src={imageUrl}
        alt={"Background-image"}
        effect={"blur"}
      />
    </div>
  );
};

const PokemonTitle = ({
  pokemonData,
  genera,
}: {
  pokemonData: PokemonData;
  genera: string;
}) => {
  return (
    <div className="flex justify-center align-middle">
      <div className="invisible mr-auto w-24" />
      <div>
        <div
          className={`${classes["fontOr"]} flex uppercase justify-center font-bold	text-5xl`}
        >
          {pokemonData.name}
        </div>
        <div className={`text-center`}>{genera}</div>
      </div>
      <div className="ml-auto w-24">
        <LazyLoadImage
          src={
            pokemonData.sprites.versions["generation-v"]["black-white"].animated
              .front_default || pokemonData.sprites.front_default
          }
        />
      </div>
    </div>
  );
};

const Pokemon = (props: any) => {
  const location = useLocation();
  const { pokemonId = 0 } = useParams();
  const pokemonDataFromLocation = location.state?.data as PokemonData;
  const [pokemonData, setPokemonData] = useState<PokemonData>();

  if (!!!pokemonId || isNaN(Number(pokemonId))) {
    return <ErrorPage />;
  }

  const fetchData = () => {
    const requestURL = `${APIBasePath}/pokemon/${pokemonId}`;

    return axios.get(requestURL);
  };
  const fetchSpeciesData = () => {
    const requestURL =
      `${pokemonData?.id}` === pokemonId && pokemonData?.species.url
        ? pokemonData?.species.url
        : `${APIBasePath}/pokemon-species/${pokemonId}`;

    return axios.get(requestURL);
  };

  const {
    data: spData,
    refetch: refetchSpeciesData,
    isLoading: speciesDataLoading,
    error: speciesError,
  } = useQuery(`species_${pokemonId}`, fetchSpeciesData, {
    refetchOnWindowFocus: false,
    enabled: +pokemonId < 10000,
  });
  const { data, isLoading, error, refetch } = useQuery(
    `pokemon_${pokemonId}`,
    fetchData,
    {
      refetchOnWindowFocus: false,
      enabled: isEmpty(pokemonDataFromLocation),
    }
  );

  useEffect(() => {
    if (isEmpty(spData) && !isEmpty(pokemonData) && +pokemonId >= 10000) {
      refetchSpeciesData();
    }
  }, [spData, pokemonData]);

  useEffect(() => {
    if (isEmpty(pokemonDataFromLocation)) return;
    setPokemonData(pokemonDataFromLocation);
  }, [pokemonDataFromLocation]);

  useEffect(() => {
    if (!isEmpty(data)) {
      const pokemonDataFromResponse = data.data as PokemonData;
      setPokemonData(pokemonDataFromResponse);
    }
  }, [data]);
  const types = pokemonData?.types || [];
  const color1 =
    PokemonTypeColors[types?.[0]?.type?.name as PokemonTypeColorKey];
  const color2 =
    PokemonTypeColors[types?.[1]?.type?.name as PokemonTypeColorKey] ||
    "transparent";
  useEffect(() => {
    if (!isEmpty(pokemonData)) {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.style.background = `linear-gradient(${
          isMobile ? 360 : 90
        }deg, ${isMobile ? color1 : color2} 0%, ${
          isMobile ? color2 : color1
        } 50%)`;
      }
    }
  }, [pokemonData]);
  const speciesData = spData?.data as PokemonSpeciesData;

  if (error || speciesError) {
    return <ErrorPage />;
  }
  if (
    isLoading ||
    isEmpty(pokemonData) ||
    speciesDataLoading ||
    isEmpty(speciesData)
  ) {
    return <Loader />;
  }
  const pokemonGenera =
    speciesData.genera.find((genusItem) => genusItem.language.name === "en")
      ?.genus || "";

  return (
    <div className={classes["pokemon_detail"]}>
      {!!pokemonData.name && (
        <Helmet>
          <title>{`PG-Dex ${startCase(pokemonData.name)}`}</title>
        </Helmet>
      )}
      <BackgroundImage
        imageUrl={pokemonData.sprites.other["official-artwork"].front_default}
      />
      <div className="flex justify-center items-center mb-2 md:mb-8 ">
        <Header isNextPrevPokemonButtonAvailable={true} />
      </div>
      <div className="flex justify- flex-col md:flex-row">
        <div
          className={`${classes["pokemon_image_section"]} flex relative flex-col w-full md:w-3/6`}
        >
          <div
            className={`${classes["ribbon"]} ${classes["ribbon-top-left"]} ${
              isMobile ? "left-5" : "left-24"
            }`}
          >
            <span style={{ backgroundColor: color1 }}># {pokemonId}</span>
          </div>
          <ImageComponent pokeData={pokemonData} />
        </div>
        <div
          className={`${classes["pokemon_detail_section"]} flex w-full md:w-3/6 justify-center`}
        >
          <div className={`${classes["detail_card"]} w-11/12`}>
            <PokemonTitle pokemonData={pokemonData} genera={pokemonGenera} />
            <div>
              <PokemonDescription
                speciesData={speciesData}
                pokemonData={pokemonData}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex w-full md:w-6/12">
                <PhysicalAndAbilities
                  pokemonData={pokemonData}
                  speciesData={speciesData}
                />
              </div>
              <div className={`flex w-full md:w-6/12`}>
                <StatChart stats={pokemonData.stats} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <EvolutionChart speciesData={speciesData} />
    </div>
  );
};

export default Pokemon;
