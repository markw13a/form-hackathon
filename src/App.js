import React from 'react';
import {FormProvider} from './FormContext';
import {NonFormDataProvider} from './NonFormDataContext';
import FormTitleCapture from './FormTitleCapture';
import {AddNewField, AddNewStaticText, Section} from './fields/Field';
import './style/main.scss';

const App = () => (
	<div className="App">
		<div className="content">
			<FormProvider>
				<FormTitleCapture />
				<NonFormDataProvider>
					<Section />
					<AddNewField />
					<AddNewStaticText />
				</NonFormDataProvider>
			</FormProvider>
		</div>
	</div>
);

export default App;
