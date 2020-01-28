import React from 'react';
import {useFormDispatch} from './FormContext';
import {useIsInFocus} from './common/Hooks';

const AddNewField = () => {
    const dispatch = useFormDispatch();

    return (
        <button onClick={() => dispatch({type: "addNewInputField"})}>
            Add field
        </button>
    );
};

const EditStatic = ({label, subHeader, index, type}) => {
    const dispatch = useFormDispatch();
    
    return (
        <div className="edit-mode">
            <input 
                type="text"
                onChange={e => dispatch({type: "editFieldValue", value: e.target.value, key: "label", index})}
                placeholder="Header..."
                value={label}
            />
            <input 
                type="text"
                onChange={e => dispatch({type: "editFieldValue", value: e.target.value, key: "subHeader", index})}
                placeholder="Sub-header..."
                value={subHeader}
            />
            <div className="type">
                <select onChange={e => dispatch({type: 'editFieldValue', index, key: 'type', value: e.target.value})} value={type}>
                    <option value="text">
                        Text input
                    </option>
                    <option value="number">
                        Number input
                    </option>
                    <option value="title">
                        Title
                    </option>
                </select>
            </div>
            <div className="remove">
                <button onClick={() => dispatch({type: 'deleteControl', index})}>
                    Delete
                </button>
            </div>
        </div>
    );
};

const EditInput = ({type, index, label, required}) => {
    const dispatch = useFormDispatch();

    return (
        <div className="edit-mode">
            <label>
                <input 
                    onChange={e => dispatch({type: 'editFieldValue', index, key: 'label', value: e.target.value})}
                    type="text"
                    value={label}
                />
            </label>
            <div className="required">
                <label>
                    Required Field
                    <input 
                        type="checkbox"
                        checked={required}
                        onChange={() => dispatch({type: 'editFieldValue', index, key: 'required', value: !required})}
                    />
                </label>
            </div>
            <div className="type">
                <select onChange={e => dispatch({type: 'editFieldValue', index, key: 'type', value: e.target.value})} value={type}>
                    <option value="text">
                        Text input
                    </option>
                    <option value="number">
                        Number input
                    </option>
                    <option value="title">
                        Title
                    </option>
                </select>
            </div>
            <div className="remove">
                <button onClick={() => dispatch({type: 'deleteControl', index})}>
                    Delete
                </button>
            </div>
        </div>
    );
};

const isStaticType = type => type === 'title';

const EditControl = props => (
    <div className="edit-mode">
        {
            isStaticType(props.type)
            ? <EditStatic {...props} />
            : <EditInput {...props} />
        }
    </div>
);

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

const Title = ({label, subHeader}) => (
    <div className="display-mode">
        <h3>{label}</h3>
        <p>{subHeader}</p>
    </div>
);

const controlForType = {
    text: Text,
    number: NumberComp,
    title: Title
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

const Field = props => {
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
                ? <EditControl {...props} />
                : <DisplayControl {...props} />
            }
        </div>
    );
};

const FormFields = ({controls}) => {

    if(controls.length === 0) {
        return null;
    }

    return (
        <div>
            {
                controls.map((control, index) => <Field {...control} index={index} key={index} />)
            }
        </div>

    );
};

export {
    AddNewField,
    FormFields
};