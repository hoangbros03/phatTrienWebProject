import { useState,useEffect } from "react";
function useDebounce(value,delay){
    const[debounceValue,setDebounceValue] =useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounceValue(value),delay);
        return ()=> clearTimeout(handler);

    } , [value] );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return debounceValue;
}
export default useDebounce;