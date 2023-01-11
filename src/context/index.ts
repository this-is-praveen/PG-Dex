import { createContext, Dispatch } from "react";

type PG_Context_Type = { contextData: any; setContextData: Dispatch<any> };
const PG_Context = createContext<PG_Context_Type | any>({});

export default PG_Context;
