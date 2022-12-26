import axios from "axios";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import PokemonCard from "../../components/PokemonCard";
import classes from "./style.module.css";

const baseURL = "https://pokeapi.co/api/v2";

export interface IPokeData {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPokemonResult[];
}

export interface IPokemonResult {
  name: string;
  url: string;
}

const App = () => {
  const initialData: IPokeData = {
    count: 0,
    next: null,
    previous: null,
    results: [{ name: "", url: "" }],
  };
  const [pokeData, setPokeData] = useState<IPokeData>(initialData);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [pokemonList, setPokemonList] = useState<IPokemonResult[]>(
    initialData.results
  );

  const apiCall = async () => {
    const initialAPIRequest = `${baseURL}/pokemon?offset=0&limit=1500`;
    const reqUrl = pokeData.next || initialAPIRequest;
    const response = await axios
      .get(reqUrl)
      .then((response) => {
        const currentResponse: IPokeData = response.data;
        setPokeData(currentResponse);
        setPokemonList(currentResponse.results.slice(0, 24));
      })
      .catch((error) => {
        console.error(error);
      });

    return response;
  };
  useEffect(() => {
    apiCall();
  }, []);

  const Next = () => {
    setPokemonList((prevData) => {
      return pokeData.results.slice(0, prevData.length + 24);
    });
  };

  const LayoutScroller = (
    <InfiniteScroll
      className="w-full"
      dataLength={pokemonList.length} //This is important field to render the next data
      next={Next}
      hasMore={
        !!!searchBarRef?.current?.value &&
        pokemonList.length + 1 < pokeData.count
      }
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <div className="flex flex-wrap justify-around">
        {pokemonList.map((data) => (
          <PokemonCard data={data} key={data.name} />
        ))}
      </div>
    </InfiniteScroll>
  );

  const onSearchChange = debounce((event) => {
    const searchBy = event.target.value;
    setPokemonList(() => {
      return !!searchBy
        ? pokeData.results.filter((value) => {
            if (!!+searchBy) {
              const id = value.url.split("/").at(-2);
              const byNumber = id === searchBy;

              return byNumber;
            } else {
              const byName = value.name
                .toLowerCase()
                .includes(searchBy.toLowerCase());

              return byName;
            }
          })
        : pokeData.results.slice(0, 24);
    });
  }, 1000);

  const SearchBar = (
    <div className="flex justify-center">
      <div className="mb-3 xl:w-96">
        <input
          ref={searchBarRef}
          type="search"
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="search-pokemon"
          placeholder="Arceus"
          onChange={onSearchChange}
        />
      </div>
    </div>
  );

  return (
    <div className={"flex flex-col w-full m-auto"}>
      <div className="flex flex-col md:flex-row justify-between items-center mx-1 mb-2 md:mx-5 md:mb-8 ">
        <div className={`${classes["page_title"]} mb-4 md:mb-0`}>PG DEX</div>
        {SearchBar}
      </div>
      <div className="flex w-full">{LayoutScroller}</div>
    </div>
  );
};

export default App;
