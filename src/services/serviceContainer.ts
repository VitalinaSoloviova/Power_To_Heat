import { DataResolver } from "../calculations/DataResolver";
import { UIService } from "./UIService";

// Backend base URL – override via Vite env when needed (VITE_API_BASE_URL).
const BASE_URL =
    (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:3001";

const dataResolver = new DataResolver(BASE_URL);

/** Application-wide singleton used by hooks/components. */
export const uiService = new UIService(dataResolver);
