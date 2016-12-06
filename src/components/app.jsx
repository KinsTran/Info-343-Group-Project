import React from "react";
import "../css/main.css";
import {Link, IndexLink} from "react-router";
import {store} from "../shared-state.js";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
    }

    componentDidMount() {
        this.unsub = store.subscribe(() => this.setState(store.getState()));
    }

    componentWillUnmount() {
        this.unsub();
    }

    render() {
        var totalMovies = 0;
        for(var i = 0; i < this.state.items.length; i++) {
                var item = this.state.items[i];
                totalMovies += item.quantity;
            }
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
                                Cart <span id="app-cart-count">{totalMovies==0?"":totalMovies}</span>
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
