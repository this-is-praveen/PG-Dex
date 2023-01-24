import { isEmpty } from "lodash";
import { Fragment, MouseEventHandler, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PG_Context from "../context";
import classes from "./styles.module.css";

type withSearchBar = {
  isSearchBarNeeded: true;
  isNextPrevPokemonButtonAvailable: false;
  onSearchChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  inputRef: React.LegacyRef<HTMLInputElement> | undefined;
  headerSearchActionProps?: {
    text: string;
    onClick: () => void;
  };
};

type withoutSearchBarWithNextAndPrevious = {
  isSearchBarNeeded?: false;
  isNextPrevPokemonButtonAvailable?: true;
};
type withoutSearchBarWithOutNextAndPrevious = {
  isSearchBarNeeded?: false;
  isNextPrevPokemonButtonAvailable?: false;
};

type IHeader =
  | withSearchBar
  | (
      | withoutSearchBarWithNextAndPrevious
      | withoutSearchBarWithOutNextAndPrevious
    );

const Header = (props: IHeader) => {
  const { isSearchBarNeeded, isNextPrevPokemonButtonAvailable } = props;

  const navigate = useNavigate();
  const { contextData } = useContext(PG_Context);
  const { pokemonId: pokemonIdFromLocation = 0 } = useParams();

  const Logo = (
    <div
      className={`${classes["page_title"]} mb-4 md:mb-0`}
      onClick={() => navigate("/")}
    >
      PG DEX
    </div>
  );

  if (isSearchBarNeeded) {
    const { inputRef, onSearchChange } = props;

    const SearchBar = (
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96 relative">
          <input
            ref={inputRef}
            type="search"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="search-pokemon"
            placeholder="Arceus"
            onChange={onSearchChange}
          />
          {props.headerSearchActionProps && (
            <span
              className="absolute top-1.5 right-4 cursor-pointer select-none"
              onClick={props.headerSearchActionProps.onClick}
            >
              {props.headerSearchActionProps.text}
            </span>
          )}
        </div>
      </div>
    );

    return (
      <Fragment>
        {Logo}
        {SearchBar}
      </Fragment>
    );
  } else if (isNextPrevPokemonButtonAvailable) {
    const Button = ({ type }: { type: "next" | "prev" }) => {
      const isNext = type === "next";
      const pokemonIdsInContext: string[] = contextData.pokemonIds || [];

      if (isEmpty(pokemonIdsInContext)) return <Fragment />;

      const indexInpokemonIdsInContext = pokemonIdsInContext.findIndex(
        (index) => index === pokemonIdFromLocation
      );


      const hidden = isNext
        ? indexInpokemonIdsInContext > pokemonIdsInContext.length + 1
        : pokemonIdFromLocation < 2;

      if (hidden || indexInpokemonIdsInContext === -1) return <Fragment />;
      const nextOrPrevIndex = isNext
        ? indexInpokemonIdsInContext + 1
        : indexInpokemonIdsInContext - 1;

      return (
        <div
          className={`!text-[3rem] ${classes["page_title"]} select-none hover:animate-pulse`}
          onClick={() =>
            navigate(`/pokemon/${pokemonIdsInContext[nextOrPrevIndex]}`, {
              state: { data: {} },
            })
          }
        >
          {isNext ? <>&raquo;</> : <>&laquo;</>}
        </div>
      );
    };

    return (
      <Fragment>
        {Logo}
        <div className="inline-flex absolute right-6 gap-6">
          <Button type="prev" />
          <Button type="next" />
        </div>
      </Fragment>
    );
  }

  return <Fragment>{Logo}</Fragment>;
};

export default Header;
