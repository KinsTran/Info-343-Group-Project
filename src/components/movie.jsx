import React from "react";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var base_url = "https://image.tmdb.org/t/p/w300";
        return (
            <div className="movie-card flex-col row">
                <div className="movie-left flex-col">
                    <img className="movie-img" src={base_url+this.props.movie.poster_path}></img>
                </div>
                <div className="movie-text flex-col">
                    <h2 className="movie-title">{this.props.movie.title}</h2>
                    <p className="movie-desc">{this.props.movie.overview}</p>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
