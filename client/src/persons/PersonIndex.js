
import React, { useState, useEffect } from 'react';
import { ApiGet } from '../common/Api';
import PersonTable from './PersonTable';
import PersonFilter from './PersonFilter';
import Role from './Role';

const PersonIndex = (props) => {


	const [directorsState, setDirectors] = useState([]);
	const [actorsState, setActors] = useState([]);
	const [directorLimitState, setDirectorLimit] = useState('');
	const [actorLimitState, setActorLimit] = useState('');

	const deletee = (role) => {
		if (Role.DIRECTOR === role) {
			ApiGet('/api/directors').then((data) => setDirectors(data));
		}

		if (Role.ACTOR === role) {
			ApiGet('/api/actors').then((data) => setActors(data));
		}
	};

	useEffect(() => {
		ApiGet('/api/directors').then((data) => setDirectors(data));

		ApiGet('/api/actors').then((data) => setActors(data));
	},[]);

	const handleChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;
		if (name === 'actorLimit') setActorLimit(value);
		else if (name === 'directorLimit') setDirectorLimit(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const directorLimit = parseInt(directorLimitState);
		const actorLimit = parseInt(actorLimitState);

		if (directorLimit) {
			const params = {
				limit: directorLimitState,
			};

			ApiGet('/api/directors', params).then((data) => setDirectors(data));
		}

		if (actorLimit) {
			const params = {
				limit: actorLimitState,
			};

			ApiGet('/api/actors', params).then((data) => setActors(data));
		}
	};

	const moreActors = actorsState.length > directorsState.length;

	return (
		<div>
			<h3>Seznam osobností</h3>
			<hr />

			<div className="row">
				<div className="col">
					<PersonFilter
						name={'actorLimit'}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						value={actorLimitState}
						label="Limit počtu herců"
						confirm="Filtrovat herce:"
					/>
				</div>
				<div className="col">
					<PersonFilter
						name={'directorLimit'}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						value={directorLimitState}
						label="Limit počtu režisérů"
						confirm="Filtrovat režiséry:"
					/>
				</div>
			</div>
			<hr />

			<div className="row">
				<div className="col">
					<PersonTable
						role={Role.ACTOR}
						delete={deletee}
						items={actorsState}
						label="Počet herců:"
						link={!moreActors}
					/>
				</div>
				<div className="col">
					<PersonTable
						role={Role.DIRECTOR}
						delete={deletee}
						items={directorsState}
						label="Počet režisérů:"
						link={moreActors}
					/>
				</div>
			</div>
		</div>
	);
};
export default PersonIndex;
