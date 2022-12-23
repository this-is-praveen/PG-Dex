import axios from "axios";
import React, {
  ChangeEventHandler,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "./home.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import PokeballLoader from "../../assets/pokeball.gif";
import { PokemonData, PokemonTypeColorKey } from "../../assets/types";
import { PokemonTypeColors } from "../../assets/globals";
import debounce from "lodash/debounce";

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
        // const removedForms
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
          <Card data={data} key={data.name} />
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
        <div
          className={`${classes["page_title"]} ${classes["card_name"]} mb-4 md:mb-0`}
        >
          PG DEX
        </div>
        {SearchBar}
      </div>
      <div className="flex w-full">{LayoutScroller}</div>
    </div>
  );
};

const Loader = () => {
  return (
    <div className="flex text-center w-full h-full justify-center">
      <div className={classes["pokeball"]} />
    </div>
  );
};

const Card = ({ data }: { data: IPokemonResult }) => {
  if (!data.name) return <Fragment />;
  const name = data.name;
  const id = data.url.split("/").at(-2);
  const paddedId = String(id).padStart(3, "0");
  const otherImageUrls = `https://img.pokemondb.net/artwork/${name}.jpg`;
  const imageUrl =
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png` ||
    `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${paddedId}.png`;
  const [imageSize, setImageSize] = useState(0);
  const [pokemonData, setPokemonData] = useState<PokemonData>();

  useEffect(() => {
    axios
      .get(data.url)
      .then((response) => {
        setPokemonData(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching ${name} data `, error);
      });
  }, []);

  const types = pokemonData?.types || [];
  const color1 =
    PokemonTypeColors[types?.[0]?.type?.name as PokemonTypeColorKey];
  const color2 =
    PokemonTypeColors[types?.[1]?.type?.name as PokemonTypeColorKey] ||
    "transparent";
  return (
    <div
      className={
        classes["card"] +
        " flex m-2 flex-col lg:basis-3/12 md:basic-5/12 basis-11/12 transform transition duration-500 hover:scale-105"
      }
      style={{
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`,
      }}
    >
      <div className={`${classes["ribbon"]} ${classes["ribbon-top-right"]}`}>
        <span style={{ backgroundColor: color1 }}># {id}</span>
      </div>
      <div className="flex justify-center">
        <LazyLoadImage
          className="test"
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
export default App;
