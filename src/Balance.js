import React from "react";

let Balance = function(props) {
    return <div style = {{position: 'absolute', top: '20px', right: '10px', fontSize: '40px', color: 'yellow'}}> Balance: {props.balance} </div>
}

export default Balance