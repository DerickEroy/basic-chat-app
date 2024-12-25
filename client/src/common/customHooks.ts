import { useState } from "react";

export function useToggleShowPassword() {
    const [flag, setFlag] = useState(false);
    
    function handler(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setFlag(p => !p);
    }

    return { handler, flag };
}