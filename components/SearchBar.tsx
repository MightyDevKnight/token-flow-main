import React, { useState } from "react";
import Box from "./Box";
import Input from "./Input";
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export default function SearchBar(props){
  const [searchWords, setSearchWords] = useState("");
  const pressEnter = (e) => {
    if (e.key === 'Enter') {
      props.setIsLoading(true);
      // console.log("enter pressed")
      props.setSearchWords(searchWords);
    }
  }
  const getSearchWords = (e) => {
    setSearchWords(e.target.value);
  }

  return (
    <Box style={{display: 'flex', alignItems: 'center', paddingLeft: '15px', position: 'fixed', zIndex: '999', width: '100%', backgroundColor: 'white'}}>
      <MagnifyingGlassIcon/>
      <Input placeholder="Search" style={{width: '100%', height: '40px', border: 'none', marginLeft: '8px', outline: 'none'}} onKeyDown={pressEnter} onChange={getSearchWords}/>
    </Box>
  )
}