import React from 'react';
import {useForm} from '../FormContext';
import {useIsInFocus} from '../common/Hooks';

const EditComponent = ({label, subHeader, index}) => {
    const [{sectionIndex}, dispatch] = useForm();
    
    return (
        <div className="edit-mode">
            <input 
                type="text"
                onChange={e => dispatch({type: "editFieldValue", value: e.target.value, key: "label", sectionIndex, index})}
                placeholder="Header..."
                value={label}
            />
            <input 
                type="text"
                onChange={e => dispatch({type: "editFieldValue", value: e.target.value, key: "subHeader", sectionIndex, index})}
                placeholder="Sub-header..."
                value={subHeader}
            />
        </div>
    );
};

const DisplayComponent = ({label, subHeader}) => (
    <div className="display-mode">
        <h3>{label}</h3>
        <p>{subHeader}</p>
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