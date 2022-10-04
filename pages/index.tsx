import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useRouter } from 'next/router'
import store from "../store";
import Home from "../components/Home";
import LoadingSpinner from "../components/Loading";
import useSWR from "swr";
import { convertToTokenArray } from "../utils/convertTokens";
import { ThemeDataTypes } from '../utils/types';

async function fetcherFunc(...args) {
  const [url, queryData] = args;
  const res = await fetch(`${url}?id=${queryData}`);
  return res.json();
}

function App() {
  let converted;
  let theme: ThemeDataTypes;
  const router = useRouter().query;
  const [fileName, setFileName] = useState(router.id);

  const { data } = useSWR(['api/data', fileName], fetcherFunc);
  
  if(typeof data === 'object' && typeof fileName !== 'undefined' && data !== null){
    const tokens = data.result.token;
    theme = data.result.themeData;
    converted = convertToTokenArray( {tokens} );
  }
  useEffect(() => {
    setFileName(router.id);
  }, [router]);
  return (
    <>
    {typeof data === 'object' ?
      <Provider store={store}>
        <Home 
          tokenArray={converted}
          activeTheme={theme?.activeTheme}
          availableThemes={theme?.availableThemes}
          usedTokenSet={JSON.parse(theme.usedTokenSet)}
          themeObjects={theme.themeObjects}
        />
      </Provider>
      :
      <LoadingSpinner/>
    }
    </>
  )
};
export default App;