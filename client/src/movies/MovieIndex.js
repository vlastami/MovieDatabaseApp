
import React, { useState, useEffect } from 'react';
import { ApiGet } from '../common/Api';
import MovieTable from './MovieTable';
import MovieFilter from './MovieFilter';

const MovieIndex = (props) => {
	const [directorListState, setDirectorList] = useState([]);
	const [actorListState, setActorList] = useState([]);
	const [genreListState, setGenreList] = useState([]);
	const [moviesState, setMovies] = useState([]);
	const [filterState, setFilter] = useState({
		directorID: '',
		actorID: '',
		genre: '',
		fromYear: '',
		toYear: '',
		limit: '',
	});


	const deletee = () => {
		ApiGet('/api/movies').then((data) => setMovies(data));
	};

	useEffect(() => {
		ApiGet('/api/directors').then((data) => setDirectorList(data));
		ApiGet('/api/actors').then((data) => setActorList(data));
		ApiGet('/api/genres').then((data) => setGenreList(data));

		ApiGet('/api/movies').then((data) => setMovies(data));
	}, []);

	const handleChange = (e) => {
		setFilter({
			filter: {
				[e.target.name]: e.target.value,
			},
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const params = filterState.filter;

		ApiGet('/api/movies', params).then((data) => setMovies(data));
	};

	return (
		<div>
			<h3>Seznam filmů</h3>
			<hr />
			<MovieFilter
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				directorList={directorListState}
				actorList={actorListState}
				genreList={genreListState}
				filter={filterState}
				confirm="Filtrovat filmy"
			/>
			<hr />
			<MovieTable delete={deletee} items={moviesState} label="Počet filmů:" />
		</div>
	);
};

export default MovieIndex;
