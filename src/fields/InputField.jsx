import React from 'react';
import {useForm} from '../FormContext';
import {useIsInFocus} from '../common/Hooks';

const EditControl = ({label, index, required, type}) => {
    const [{sectionIndex}, dispatch] = useForm();

    return (
        <div className="edit-mode">
            <label>
                <input 
                    onChange={e => dispatch({type: 'editFieldValue', index, key: 'label', sectionIndex, value: e.target.value})}
                    type="text"
                    value={label}
                />
            </label>
            <div className="type">
                <select onChange={e => dispatch({type: 'editFieldValue', index, key: 'type', sectionIndex, value: e.target.value})} value={type}>
                    <option value="text">
                        Text input
                    </option>
                    <option value="number">
                        Number input
                    </option>
                </select>
            </div>
            <div className="required">
                <label>
                    Required Field
                    <input 
                        type="checkbox"
                        checked={required}
                        onChange={() => dispatch({type: 'editFieldValue', index, key: 'required', sectionIndex, value: !required})}
                    />
                </label>
            </div>
        </div>
    );
};

const Text = ({label, required}) => (
    <>
        <label>
            {label}
            {
                required
                && <span className="error">*</span>
            }
        </label>
        <input 
            type="text"
        />
    </>
);

const NumberComp = ({label, required}) => (
    <>
        <label>
            {label}
            {
                required
                && <span className="error">*</span>
            }
        </label>
        <input 
            type="number"
        />
    </>
);

const controlForType = {
    text: Text,
    number: NumberComp
};

const DisplayControl = ({type, ...controlProps}) => {
    const Control = controlForType[type];

    if(!Control) {
        throw new Error(`Unsupported control type ${type}`);
    }

    return (
        <div className="display-mode">
            <Control {...controlProps} />
        </div>
    );
};


const InputField = props => {
    const {isInFocus, onBlur, onFocus} = useIsInFocus();
    
    return (
        <div 
            className="field"
            onBlur={onBlur}
            onFocus={onFocus}
        >
            {
                isInFocus
                ? <EditControl {...props} />
                : <DisplayControl {...props} />
            }
        </div>
    );
};

export default InputField;