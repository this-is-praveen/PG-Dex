import { useState } from "react";
import PokeballLoader from "../assets/pokeball.gif";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export const LazyPokemonImage = ({ src, alt, className }: Props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex justify-center items-center">
      {!loaded && (
        <img
          src={PokeballLoader}
          className="w-16 h-16 absolute"
          alt="loading"
        />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};
