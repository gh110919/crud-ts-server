import endpoints from "../assets/endpoints.json";

export type Files = {
  endpoints: typeof endpoints;
};

export const imports: Files = {
  endpoints,
};
