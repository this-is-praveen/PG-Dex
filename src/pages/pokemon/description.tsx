import { FastAverageColorResult } from "fast-average-color";
import { isEmpty, uniq } from "lodash";
import { Fragment } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Autoplay, EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import { Swiper, SwiperSlide } from "swiper/react";
import Typewriter from "typewriter-effect";
import { PokemonTypeColors } from "../../assets/globals";
import { PokemonData, PokemonSpeciesData } from "../../assets/types";
import classes from "./styles.module.css";

const PokemonDescription = ({
  speciesData,
  pokemonData,
}: {
  speciesData: PokemonSpeciesData;
  pokemonData: PokemonData;
}) => {
  const flavor_text = uniq(
    speciesData.flavor_text_entries
      .filter((textEntry) => textEntry.language.name === "en")
      .map((textEntry) => textEntry.flavor_text)
  );
  const types = pokemonData.types.map((type) => type.type.name);

  return (
    <Fragment>
      <div className={`justify-center mb-4 flex gap-4`}>
        {types.map((type, index) => {
          const typeName = type as keyof typeof PokemonTypeColors;
          const imageUrl = `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/type-logos/gen8/${typeName}.png`;

          return (
            <div
              key={type}
              className={`flex ${
                !index ? "flex-row-reverse" : ""
              } w-32 min-w-max px-3 justify-center items-center text-md align-center uppercase tracking-[.5rem]`}
              style={{ background: PokemonTypeColors[typeName] }}
            >
              {typeName}
              <LazyLoadImage src={imageUrl} className="h-8 brightness-full" />
            </div>
          );
        })}
      </div>
      <div
        className={`${classes["desc_block"]} ${classes["type_writter_block"]}`}
      >
        <Typewriter
          options={{
            strings: isEmpty(flavor_text)
              ? "No Information Available"
              : flavor_text,
            delay: 25,
            deleteSpeed: 10,
            autoStart: true,
            loop: true,
          }}
        />
      </div>
    </Fragment>
  );
};

export default PokemonDescription;
