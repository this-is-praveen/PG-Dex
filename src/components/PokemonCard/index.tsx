import axios from "axios";
import { isEmpty } from "lodash";
import { Fragment, useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { PokemonTypeColors } from "../../assets/globals";
import PokeballLoader from "../../assets/pokeball.gif";
import { PokemonData, PokemonTypeColorKey } from "../../assets/types";
import PG_Context from "../../context";
import { IPokemonResult } from "../../pages/home";
import classes from "./style.module.css";

const PokemonCard = ({ data }: { data: IPokemonResult }) => {
  if (!data.name) return <Fragment />;
  const name = data.name;
  const id = data.url.split("/").at(-2);
  const [pokemonData, setPokemonData] = useState<PokemonData>();
  const imageUrl =
    pokemonData?.sprites.other.home.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

  const { data: { data: cardData } = {} } = useQuery(`pokemon_card_${id}`, () =>
    axios.get(data.url)
  );

  useEffect(() => {
    // axios
    //   .get(data.url)
    //   .then((response) => {
    //     setPokemonData(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(`Error fetching ${name} data `, error);
    //   });

    if (!isEmpty(cardData)) {
      setPokemonData(cardData);
    }
  }, [cardData]);

  const types = pokemonData?.types || [];
  const color1 =
    PokemonTypeColors[types?.[0]?.type?.name as PokemonTypeColorKey];
  const color2 =
    PokemonTypeColors[types?.[1]?.type?.name as PokemonTypeColorKey] ||
    "transparent";

  const navigate = useNavigate();

  const cardOnClick = () => {
    navigate(`/pokemon/${id}`, { state: { data: pokemonData } });
  };

  return (
    <div
      className={
        classes["card"] +
        " group flex m-2 flex-col lg:basis-3/12 md:basic-5/12 basis-11/12 "
      }
      style={{
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`,
      }}
      onClick={cardOnClick}
    >
      <div className={`${classes["ribbon"]} ${classes["ribbon-top-right"]}`}>
        <span style={{ backgroundColor: color1 }}># {id}</span>
      </div>

      <div className="flex justify-center group-hover:scale-110 transform transition duration-500 ease-out">
        <LazyLoadImage
          className={``}
          src={!!id && +id > 1000 ? imageUrl : imageUrl}
          width={200}
          alt={name}
          height={200}
          effect={"blur"}
          placeholderSrc={PokeballLoader}
        />
      </div>
      <div className="flex">
        <div className="bg-white w-full pt-5 pb-8 text-center">
          <h1
            className={
              classes["card_name"] + " capitalize font-semibold text-3xl mb-2"
            }
          >
            {name}
          </h1>
          <div className="flex mx-auto justify-center">
            {types.map(({ type }, index) => {
              const typeName = type.name as PokemonTypeColorKey;

              return (
                <p
                  key={`${id}-${typeName}`}
                  className={
                    classes["card_type"] +
                    " font-bold uppercase mt-2" +
                    (index !== types.length - 1 ? " mr-6" : "")
                  }
                  style={{ color: PokemonTypeColors[typeName] }}
                >
                  {typeName}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
