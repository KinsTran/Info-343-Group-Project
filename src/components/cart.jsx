import React from "react";
import Movie from "./movie.jsx";
import {store, removeMovie, changeCount} from "../shared-state.js";

var N = require('numeral');

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
        var movies = this.state.items.map(m => <div className="cart-item">
                                                    <Movie key={m.item.id+""+m.format} movie={m.item}>
                                                        <div className="buy-row">
                                                            <div className="buy-col" onClick={() => store.dispatch(removeMovie(m.item.id+""+m.format))}>
                                                                Remove
                                                            </div>
                                                        </div>
                                                    </Movie>
                                                    <div className="cart-format">
                                                        {
                                                            m.format=="dvd"?"DVD":"Blu-Ray"
                                                        }
                                                    </div>
                                                    <div className="cart-quantity">
                                                        <div className="minus-quantity change-quantity" 
                                                        onClick={() => store.dispatch(changeCount(m.item.id+""+m.format, -1))}>
                                                            <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                                        </div>
                                                        <div>
                                                             {m.quantity}
                                                        </div>
                                                        <div className="plus-quantity change-quantity"
                                                        onClick={() => store.dispatch(changeCount(m.item.id+""+m.format, 1))}>
                                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                    <div className="cart-price">
                                                        {N(m.price).format('$0,0.00')}
                                                    </div>
                                                </div>
                                                );
            var totalPrice = 0;
            for(var i = 0; i < this.state.items.length; i++) {
                var item = this.state.items[i];
                totalPrice += item.price * item.quantity;
            }
            var afterTax = totalPrice*1.1;
            var tableHead = (<p>Cart is Empty</p>);
            var priceDisplay = (<p></p>);
            if(this.state.items.length > 0) {
                tableHead = (
                    <div id="table-headers">
                        <div id="empty-head">
                        </div>
                        <div id="format-head" className="cart-header">
                            Format
                        </div>
                        <div id="quantity-head" className="cart-header">
                            Quantity
                        </div>
                        <div id="price-head" className="cart-header">
                            Price
                        </div>
                    </div>
                );
                priceDisplay = (
                    <div id="total-price">
                        <p>Subtotal: {N(totalPrice).format('$0,0.00')}</p>
                        <p>Total: {N(afterTax).format('$0,0.00')}</p>
                    </div>
                );
            }
        return (
            <div className="container">
                <h1>Your Cart</h1>
                {tableHead}
                {movies}
                {priceDisplay}
            </div>
        );
    }
}
