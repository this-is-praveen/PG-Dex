import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./styles.module.css";

type withSearchBar = {
  isSearchBarNeeded: true;
  onSearchChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  inputRef: React.LegacyRef<HTMLInputElement> | undefined;
  headerSearchActionProps?: {
    text: string;
    onClick: () => void;
  };
};

type withoutSearchBar = {
  isSearchBarNeeded?: false;
};

type IHeader = withSearchBar | withoutSearchBar;

const Header = (props: IHeader) => {
  const { isSearchBarNeeded } = props;
  const navigate = useNavigate();

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
  }

  return <Fragment>{Logo}</Fragment>;
};

export default Header;
