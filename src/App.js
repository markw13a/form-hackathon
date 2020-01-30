import React from 'react';
import {FormProvider} from './FormContext';
import Header from './Header';
import FormFields from './FormFields';
import Section from './Sections';
import './style/main.scss';

const AppContainer = ({children}) => (
	<div className="App">
		<div className="content">
			{children}
		</div>
	</div>
);

const App = () => (
	<FormProvider>
		<AppContainer>
			<Header />
			<Section />
			<FormFields />
		</AppContainer>
	</FormProvider>
);

export default App;
