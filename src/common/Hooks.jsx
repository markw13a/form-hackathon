import {useState, useCallback} from 'react';

const useIsInFocus = () => {
    const [isInFocus, setisInFocus] = useState(false);
    // https://reactjs.org/docs/accessibility.html#mouse-and-pointer-events
    const [focusTimeout, setFocusTimeout] = useState();

    const onBlur = useCallback(() => {
        const timeout = setTimeout(() => setisInFocus(false));                
        setFocusTimeout(timeout);
    }, [setFocusTimeout, setisInFocus]);

    const onFocus = useCallback(() => {
        clearTimeout(focusTimeout);
        setisInFocus(true);
    }, [focusTimeout, setisInFocus]);

    return ({
        isInFocus,
        onBlur,
        onFocus
    });
};

export {
    useIsInFocus
};