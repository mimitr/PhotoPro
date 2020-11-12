import React from 'react';
import Toolbar from '../../components/toolbar/toolbar';
import Collections from '../../components/collections/collections';

export default function CollectionsPage(props) {
  console.log(
    `In collectionsPage - props.location.state.userID = ${props.location.state.userID}`
  );
  return (
    <React.Fragment>
      <Toolbar />
      <Collections userID={props.location.state.userID} />
    </React.Fragment>
  );
}
