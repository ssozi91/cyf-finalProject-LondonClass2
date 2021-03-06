import React from 'react';


const Button = props =>
<button  onClick={props.onClick} className="btn btn-primary btn-lg mx-auto">{props.button}</button>


export default Button;