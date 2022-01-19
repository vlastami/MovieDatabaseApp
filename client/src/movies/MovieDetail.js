
import React, { useEffect, useState } from 'react';
import { ApiGet } from '../common/Api';
import Genre from './Genre';

const MovieDetail = (props) => {
	const [movieNameState, setMovieName] = useState('');
	const [yearState, setYear] = useState(0);
	const [directorState, setDirector] = useState('');
	const [actorsState, setActors] = useState([]);
	const [genresState, setGenres] = useState([]);
	const [availableState, setAvailable] = useState(false);
	const [addedState, setAdded] = useState('');

	useEffect(() => {
		ApiGet('/api/movies/' + props.match.params.id)
			.then((data) => {
				setMovieName(data.name);
				setYear(data.year);
				setDirector(data.director);
				setActors(data.actors);
				setGenres(data.genres);
				setAvailable(data.isAvailable);
				setAdded(data.dateAdded);
			})
			.catch((error) => {
				console.error(error);
			});
	},[]);
	const genres = genresState.map((item) => Genre[item]);
	const actors = actorsState.map((item) => item.name);
	const dateAdded = new Date(addedState);

	return (
		<div>
			<h1>Detail filmu</h1>
			<hr />
			<h3>
				{movieNameState} <small>({yearState})</small>
			</h3>
			<p>{genres.join(' / ')}</p>
			<p>
				<strong>Režie: </strong>
				{directorState.name}
				<br />
				<strong>Hrají: </strong>
				{actors.join(', ')}
				<br />
				<strong>Dostupný: </strong>
				{availableState ? 'ANO' : 'NE'}
				<br />
				<em>Vytvořeno {dateAdded.toLocaleString()}</em>
			</p>
		</div>
	);
};

export default MovieDetail;
