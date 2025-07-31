/// <reference types="react-scripts" />
declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_API_URI: string;
    REACT_APP_VERSION: string;
    REACT_APP_DASHBOARD_YEARS: number;
    REACT_APP_HISTORY_YEARS: number;
    REACT_APP_PROCESS_YEARS: number;
    REACT_APP_BRAND: string;
  }
}
