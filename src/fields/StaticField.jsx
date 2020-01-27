import React from 'react';
import {useFormDispatch} from '../FormContext';
import {useIsInFocus} from '../common/Hooks';

const EditComponent = ({label, index}) => {
    const dispatch = useFormDispatch();
    
    return (
        <div className="edit-mode">
            <input 
                type="text"
                onChange={e => dispatch({type: "editFieldValue", value: e.target.value, key: "label", index})}
                value={label}
            />
        </div>
    );
};

const DisplayComponent = ({label}) => (
    <div className="display-mode">
        <h3>{label}</h3>
    </div>
);

const StaticField = props => {
    const {isInFocus, onBlur, onFocus} = useIsInFocus();
    console.warn({isInFocus});
    return (
        <div 
            className="field"
            onBlur={onBlur}
            onFocus={onFocus}
        >
            {
                isInFocus
                ? <EditComponent {...props} />
                : <DisplayComponent {...props} />
            }
        </div>
    );
};

export default StaticField;