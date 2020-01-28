import React from 'react';
import {useFormDispatch} from '../FormContext';
import {useNonFormDataState} from '../NonFormDataContext';
import {useIsInFocus} from '../common/Hooks';

const EditComponent = ({label, index}) => {
    const dispatch = useFormDispatch();
    const {sectionIndex} = useNonFormDataState();
    
    return (
        <div className="edit-mode">
            <input 
                type="text"
                onChange={e => dispatch({type: "editFieldValue", value: e.target.value, key: "label", sectionIndex, index})}
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

// Need to use tabIndex for the element to be "focusable"
const StaticField = props => {
    const {isInFocus, onBlur, onFocus} = useIsInFocus();
    return (
        <div 
            className="field"
            onBlur={onBlur}
            onFocus={onFocus}
            tabIndex="0"
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