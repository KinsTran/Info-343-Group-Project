import React from "react";
import "../css/main.css";
import {Link, IndexLink} from "react-router";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
     
        return (
            <div id="container">
                <nav id="nav-bar">
                    <ul className="flex-row">
                        <li className="flex-col" id="logo">
                        </li>
                        <li className="flex-col">
                            <IndexLink to="/" activeClassName="active">
                                Movies
                            </IndexLink>
                        </li>
                        <li className="flex-col">
                            <Link to="/cart" activeClassName="active">
                                Cart
                            </Link>
                        </li>
                    </ul>
                </nav>
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}
