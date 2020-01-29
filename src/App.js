import React from 'react';
import {FormProvider} from './FormContext';
import FormTitleCapture from './FormTitleCapture';
import {AddNewField} from './Field';
import {Section, SectionControls, SectionTitle} from './Sections';
import './style/main.scss';

const App = () => (
	<div className="App">
		<header><h1>Chameleon Form Builder</h1></header>
		<div className="content">
			<FormProvider>
				<FormTitleCapture />
				<SectionTitle />
				<SectionControls />
				<Section />
				<AddNewField />
			</FormProvider>
		</div>
	</div>
);

export default App;
