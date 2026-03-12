import { PokemonData } from "../../assets/types";
import { useState, useMemo } from "react";
import classes from "./styles.module.css";
import { GenderToggle, ShinyToggle } from "./TypeToggle";
import { LazyPokemonImage } from "../LazyPokemonImage";

type Props = {
  pokeData: PokemonData;
};

export const PokemonMainDisplayCard = ({ pokeData }: Props) => {
  const [isShiny, setIsShiny] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");

  const homeSprites = pokeData.sprites.other.home;

  const hasFemaleSprite = Boolean(homeSprites.front_female);

  const imageUrl = useMemo(() => {
    if (gender === "female") {
      return homeSprites[isShiny ? "front_shiny_female" : "front_female"];
    }

    return homeSprites[isShiny ? "front_shiny" : "front_default"];
  }, [homeSprites, gender, isShiny]);

  return (
    <div className={"POKEMON_MAIN_CARD " + classes.imageWrapper}>
      <div className={classes.controls}>
        <ShinyToggle isShiny={isShiny} onToggle={() => setIsShiny((p) => !p)} />

        {hasFemaleSprite && (
          <GenderToggle gender={gender} onToggle={setGender} />
        )}
      </div>

      {imageUrl ? (
        <LazyPokemonImage
          src={imageUrl}
          alt={pokeData.name}
          className={"POKEMON_IMAGE " + classes.pokemonImage}
        />
      ) : (
        <div className={"POKEMON_FALLBACK " + classes.fallback}>?</div>
      )}
    </div>
  );
};
