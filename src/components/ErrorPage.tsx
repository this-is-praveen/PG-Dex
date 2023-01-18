import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useRouteError } from "react-router-dom";
import PokeballLoader from "../assets/pokeball.gif";

const ErrorPage = () => {
  const imageBaseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
  const navigate = useNavigate();
  const error: any = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center">
      <LazyLoadImage
        src={`${imageBaseUrl}/other/dream-world/143.svg`}
        placeholderSrc={PokeballLoader}
      />
      <div className="flex font-['gb'] text-3xl">
        Route has been blocked by Snorlax
      </div>
      <div className="flex items-center font-['gb'] text-2xl">
        <button className="mt-3" onClick={() => navigate("/")}>
          Go Home
        </button>
        {error?.statusText || error?.message}
        <LazyLoadImage
          src={`${imageBaseUrl}/versions/generation-v/black-white/animated/143.gif`}
        />
      </div>
    </div>
  );
};

export default ErrorPage;
