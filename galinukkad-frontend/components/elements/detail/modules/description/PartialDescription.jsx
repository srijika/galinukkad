import React from 'react';
import Parser from 'html-react-parser';


const PartialDescription = (props) => {
    const { description } = props;

return (<div className="content" dangerouslySetInnerHTML={{ __html: description? Parser(description) : '<p>No description found.</p>' }}  ></div>);
}
   
export default PartialDescription;
