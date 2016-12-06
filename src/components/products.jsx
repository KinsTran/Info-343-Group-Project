import React from "react";

import "whatwg-fetch";

import Movie from "./movie.jsx";
import Genre from "./genre.jsx";
import {store, addMovie} from "../shared-state.js";

var currentPage = 1;
const PAGE = "&page=";
const QUERY = "&query=";
const GENRE = "&with_genres=";

const APIKEY = "99da2dbebf95c2c5221353042cf7c30f";
const BASE_URL = "https://api.themoviedb.org/3"
const DISCOVER_API = BASE_URL + "/discover/movie?api_key=" + APIKEY;
const GENRES_API = BASE_URL + "/genre/movie/list?api_key=" + APIKEY;
const SEARCH_API = BASE_URL + "/search/movie?api_key=" + APIKEY;
var currentURL = DISCOVER_API;
var currentGenre;


export default class extends React.Component {
    constructor(props) {
        super(props);

        //initialize the component state to an empty object
        this.state = {list: [], query: ""};
    }

    // Borrowed idea from this stack overflow
    // http://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
    componentDidMount() {
        fetch(currentURL + PAGE + currentPage)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                genres: this.state.genres,
                query: this.state.query
            }));
        fetch(GENRES_API)
            .then(response => response.json())
            .then(data => this.setState({
                movies: this.state.movies,
                genres: data,
                query: this.state.query
            }));
    }

    handleChange(event) {
        this.setState({
            movies: this.state.movies,
            genres: this.state.genres,
            query: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        currentPage = 1;
        currentURL = SEARCH_API+QUERY+this.state.query;
        fetch(currentURL + PAGE + currentPage)
            .then(response=>response.json())
            .then(data => this.setState({
                movies: data,
                genres: this.state.genres,
                query: this.state.query
            }));
    }

    handlePageUp() {
        currentPage++;
        this.pageChange();
    }

    handlePageDown() {
        currentPage--;
        this.pageChange();
    }

    pageChange() {
        fetch(currentURL + PAGE + currentPage)
            .then(response=>response.json())
            .then(data => this.setState({
                movies: data,
                genres: this.state.genres,
                query: this.state.query
            }));
    }

    handleGenreChange(event) {
        currentPage = 1;
        currentGenre = event.target.getAttribute("value");
        currentURL = DISCOVER_API + GENRE + currentGenre + PAGE + currentPage;
        fetch(currentURL)
            .then(response=>response.json())
            .then(data => this.setState({
                movies: data,
                genres: this.state.genres,
                query: this.state.query
            }));
    }

    render() {
        var previousPage;
        var nextPage;
        var totalPages;
        var movies;
        var genres;
        if(this.state.movies) {
            // var mov = this.state.movies;
            var mov = this.state.movies;
            if (mov) {
                totalPages = (
                    <p className="pagination" id="numPages">{mov.total_pages} pages</p>
                );
                if(currentPage < mov.total_pages) {
                    nextPage = (
                        <p onClick={event => this.handlePageUp()} className="pagination selectable">
                            Next Page: {currentPage + 1}
                        </p>
                    );
                } else {
                    nextPage = (
                        <p onClick={event => this.handlePageUp()} className="pagination">
                            Next Page
                        </p>
                    );
                }
                if(currentPage > 1) {
                    previousPage = (
                        <p onClick={event => this.handlePageDown()} className="pagination selectable">
                            Previous Page: {currentPage - 1}
                        </p>
                    );
                } else {
                    previousPage = (
                        <p onClick={event => this.handlePageDown()} className="pagination">
                            Previous Page
                        </p>
                    );
                }

                movies = mov.results.map(m => <Movie key={m.id} movie={m}>
                                                    <div className="buy-row">
                                                        <div className="buy-col" onClick={() => store.dispatch(addMovie(m, "dvd"))}>
                                                            Buy DVD
                                                        </div>
                                                        <div className="buy-col" onClick={() => store.dispatch(addMovie(m, "blu"))}>
                                                            Buy Blu-Ray
                                                        </div>
                                                    </div>
                                                </Movie>);
            }

            var gen = this.state.genres;
            if (gen) {
                genres = gen.genres.map(g => (
                    <Genre key={g.id} id={g.id} genre={g.name} onClick={event => this.handleGenreChange(event)}/>
                ));
            }

        }

        return (
            <div id="product-flex">
                <div id="product-genres">
                    <form className="search-form"
                        onSubmit={event => this.handleSubmit(event)}>
                        <input type="text" className="form-control"
                            placeholder="search movies"
                            value={this.state.query}
                            onChange={event => this.handleChange(event)} />
                    </form>
                    <ul id="genres-list">
                        {genres}
                    </ul>
                </div>
                <div id="product-movies">
                    <div id="page-nav">
                    {previousPage}
                    {totalPages}
                    {nextPage}
                    </div>
                    <div className="container flex-row" id="products">
                        {movies}
                    </div>
                </div>
            </div>
        );
    }
}
