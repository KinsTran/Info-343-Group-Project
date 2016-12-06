import React from "react";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="genre-list-item">
                <div className="genre-box" value={this.props.id} onClick={this.props.onClick}>
                    {this.props.genre}
                </div>
            </li>
        );
    }
}
