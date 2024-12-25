import { useState } from "react";

export function useToggleShowPassword() {
    const [isShow, setIsShow] = useState(false);
    
    function handler(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsShow(p => !p);
    }

    return { handler, isShow };
}