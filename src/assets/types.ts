import { PokemonStatColors, PokemonTypeColors } from "./globals";

export interface PokemonData {
  abilities: Ability[];
  base_experience: any;
  forms: Form[];
  game_indices: any[];
  height: number;
  held_items: any[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: any[];
  name: string;
  order: number;
  past_types: any[];
  species: Species;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

export interface Ability {
  ability: Ability2;
  is_hidden: boolean;
  slot: number;
}

export interface Ability2 {
  name: string;
  url: string;
}

export interface Form {
  name: string;
  url: string;
}

export interface Species {
  name: string;
  url: string;
}

export interface Sprites {
  back_default: any;
  back_female: any;
  back_shiny: any;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
  other: Other;
  versions: Versions;
}

export interface Other {
  dream_world: DreamWorld;
  home: Home;
  "official-artwork": OfficialArtwork;
}

export interface DreamWorld {
  front_default: any;
  front_female: any;
}

export interface Home {
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface OfficialArtwork {
  front_default: string;
}

export interface Versions {
  "generation-i": GenerationI;
  "generation-ii": GenerationIi;
  "generation-iii": GenerationIii;
  "generation-iv": GenerationIv;
  "generation-v": GenerationV;
  "generation-vi": GenerationVi;
  "generation-vii": GenerationVii;
  "generation-viii": GenerationViii;
}

export interface GenerationI {
  "red-blue": RedBlue;
  yellow: Yellow;
}

export interface RedBlue {
  back_default: any;
  back_gray: any;
  back_transparent: any;
  front_default: any;
  front_gray: any;
  front_transparent: any;
}

export interface Yellow {
  back_default: any;
  back_gray: any;
  back_transparent: any;
  front_default: any;
  front_gray: any;
  front_transparent: any;
}

export interface GenerationIi {
  crystal: Crystal;
  gold: Gold;
  silver: Silver;
}

export interface Crystal {
  back_default: any;
  back_shiny: any;
  back_shiny_transparent: any;
  back_transparent: any;
  front_default: any;
  front_shiny: any;
  front_shiny_transparent: any;
  front_transparent: any;
}

export interface Gold {
  back_default: any;
  back_shiny: any;
  front_default: any;
  front_shiny: any;
  front_transparent: any;
}

export interface Silver {
  back_default: any;
  back_shiny: any;
  front_default: any;
  front_shiny: any;
  front_transparent: any;
}

export interface GenerationIii {
  emerald: Emerald;
  "firered-leafgreen": FireredLeafgreen;
  "ruby-sapphire": RubySapphire;
}

export interface Emerald {
  front_default: any;
  front_shiny: any;
}

export interface FireredLeafgreen {
  back_default: any;
  back_shiny: any;
  front_default: any;
  front_shiny: any;
}

export interface RubySapphire {
  back_default: any;
  back_shiny: any;
  front_default: any;
  front_shiny: any;
}

export interface GenerationIv {
  "diamond-pearl": DiamondPearl;
  "heartgold-soulsilver": HeartgoldSoulsilver;
  platinum: Platinum;
}

export interface DiamondPearl {
  back_default: any;
  back_female: any;
  back_shiny: any;
  back_shiny_female: any;
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface HeartgoldSoulsilver {
  back_default: any;
  back_female: any;
  back_shiny: any;
  back_shiny_female: any;
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface Platinum {
  back_default: any;
  back_female: any;
  back_shiny: any;
  back_shiny_female: any;
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface GenerationV {
  "black-white": BlackWhite;
}

export interface BlackWhite {
  animated: Animated;
  back_default: any;
  back_female: any;
  back_shiny: any;
  back_shiny_female: any;
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface Animated {
  back_default: any;
  back_female: any;
  back_shiny: any;
  back_shiny_female: any;
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface GenerationVi {
  "omegaruby-alphasapphire": OmegarubyAlphasapphire;
  "x-y": XY;
}

export interface OmegarubyAlphasapphire {
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface XY {
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface GenerationVii {
  icons: Icons;
  "ultra-sun-ultra-moon": UltraSunUltraMoon;
}

export interface Icons {
  front_default: any;
  front_female: any;
}

export interface UltraSunUltraMoon {
  front_default: any;
  front_female: any;
  front_shiny: any;
  front_shiny_female: any;
}

export interface GenerationViii {
  icons: Icons2;
}

export interface Icons2 {
  front_default: any;
  front_female: any;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Stat2;
}

export interface Stat2 {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: Type2;
}

export interface Type2 {
  name: string;
  url: string;
}

export type PokemonTypeColorKey = keyof typeof PokemonTypeColors;
export type PokemonStatColorKey = keyof typeof PokemonStatColors;

export interface PokemonSpeciesData {
  base_happiness: number;
  capture_rate: number;
  color: Color;
  egg_groups: EggGroup[];
  evolution_chain: EvolutionChain;
  evolves_from_species: any;
  flavor_text_entries: FlavorTextEntry[];
  form_descriptions: any[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: Genera[];
  generation: Generation;
  growth_rate: GrowthRate;
  habitat: Habitat;
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: Name[];
  order: number;
  pal_park_encounters: PalParkEncounter[];
  pokedex_numbers: PokedexNumber[];
  shape: Shape;
  varieties: Variety[];
}

export interface Color {
  name: string;
  url: string;
}

export interface EggGroup {
  name: string;
  url: string;
}

export interface EvolutionChain {
  url: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: Language;
  version: Version;
}

export interface Language {
  name: string;
  url: string;
}

export interface Version {
  name: string;
  url: string;
}

export interface Genera {
  genus: string;
  language: Language2;
}

export interface Language2 {
  name: string;
  url: string;
}

export interface Generation {
  name: string;
  url: string;
}

export interface GrowthRate {
  name: string;
  url: string;
}

export interface Habitat {
  name: string;
  url: string;
}

export interface Name {
  language: Language3;
  name: string;
}

export interface Language3 {
  name: string;
  url: string;
}

export interface PalParkEncounter {
  area: Area;
  base_score: number;
  rate: number;
}

export interface Area {
  name: string;
  url: string;
}

export interface PokedexNumber {
  entry_number: number;
  pokedex: Pokedex;
}

export interface Pokedex {
  name: string;
  url: string;
}

export interface Shape {
  name: string;
  url: string;
}

export interface Variety {
  is_default: boolean;
  pokemon: Pokemon;
}

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonAbilityData {
  effect_changes: any[]
  effect_entries: EffectEntry[]
  flavor_text_entries: FlavorTextEntry[]
  generation: Generation
  id: number
  is_main_series: boolean
  name: string
  names: Name[]
  pokemon: Pokemon[]
}

export interface EffectEntry {
  effect: string
  language: Language
  short_effect: string
}

export interface Language {
  name: string
  url: string
}

export interface FlavorTextEntry {
  flavor_text: string
  language: Language2
  version_group: VersionGroup
}

export interface Language2 {
  name: string
  url: string
}

export interface VersionGroup {
  name: string
  url: string
}

export interface Generation {
  name: string
  url: string
}

export interface Name {
  language: Language3
  name: string
}

export interface Language3 {
  name: string
  url: string
}

export interface Pokemon {
  is_hidden: boolean
  pokemon: Pokemon2
  slot: number
}

export interface Pokemon2 {
  name: string
  url: string
}
