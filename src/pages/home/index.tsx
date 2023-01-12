import axios from "axios";
import debounce from "lodash/debounce";
import { useContext, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import PokemonCard from "../../components/PokemonCard";
import classes from "./style.module.css";
import { useQuery } from "react-query";
import { isEmpty } from "lodash";
import Loader from "../../components/Loader";
import { APIBasePath } from "../../utils";
import PG_Context from "../../context";
import React from "react";

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

const HomePage = () => {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const requestURL = `${APIBasePath}/pokemon?limit=-1`;

  const { contextData, setContextData } = useContext(PG_Context);
  const initialData: IPokeData = !isEmpty(contextData.pokemonsData)
    ? contextData.pokemonsData
    : {
        count: 0,
        next: null,
        previous: null,
        results: [{ name: "", url: "" }],
      };
  const [pokemonList, setPokemonList] = useState<IPokemonResult[]>(
    initialData.results.length > 1 && !isEmpty(contextData.pokemonList)
      ? contextData.pokemonList
      : initialData.results
  );
  const [pokeData, setPokeData] = useState<IPokeData>(initialData);

  const fetchAllPokemons = () =>
    axios
      .get(requestURL)
      .then((response) => {
        const currentResponse: IPokeData = response.data;
        setContextData((prevState: any) => ({
          ...prevState,
          pokemonsData: currentResponse,
          pokemonIds: currentResponse.results.map((data) =>
            data.url.split("/").at(-2)
          ),
        }));

        return currentResponse;
      })
      .catch((error) => {
        console.error(error);
      });
  const { isLoading, error, data } = useQuery(
    "allPokemonData",
    fetchAllPokemons,
    { enabled: !pokeData.count }
  );

  useEffect(() => {
    if (!isEmpty(data)) {
      const res = data as IPokeData;
      setPokeData(res);
      setPokemonList(res.results.slice(0, 24));
      setContextData((prevState: any) => ({
        ...prevState,
        pokemonList: res.results.slice(0, 24),
      }));
    }
  }, [data]);

  const Next = () => {
    setPokemonList((prevData) =>
      pokeData.results.slice(0, prevData.length + 24)
    );
    setContextData((prevState: any) => ({
      ...prevState,
      pokemonList: pokeData.results.slice(0, pokemonList.length + 24),
    }));
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
      loader={null}
      endMessage={
        isLoading || true ? (
          <Loader />
        ) : !pokemonList.length ? (
          <p style={{ textAlign: "center" }}>
            <b>No Results : (</b>
          </p>
        ) : (
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        )
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
              const byNumber = id?.includes(searchBy);

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

  if (error) {
    const { message: errorMessage } = error as any;
    return <h1>Oops unable to connect to PokeAPI V2 {errorMessage}</h1>;
  }

  const headerSearchActionProps = {
    text: "Go Random",
    onClick: () => {
      const results = pokeData.results;
      const randomIndex = Math.floor(Math.random() * results.length);
      const randomPkmn = results[randomIndex];
      const randomPkmnId = randomPkmn.url.split("/").at(-2);
      navigate(`/pokemon/${randomPkmnId}`);
    },
  };

  return (
    <div
      className={`${classes["pokemons_list"]} mh-screen flex flex-col w-full m-auto`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mx-1 mb-2 md:mx-5 md:mb-8 ">
        <Header
          isSearchBarNeeded={true}
          onSearchChange={onSearchChange}
          inputRef={searchBarRef}
          headerSearchActionProps={headerSearchActionProps}
          isNextPrevPokemonButtonAvailable={false}
        />
      </div>
      <div className="flex w-full">{LayoutScroller}</div>
    </div>
  );
};

export default HomePage;
