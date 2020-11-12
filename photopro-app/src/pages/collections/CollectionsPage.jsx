import React from 'react';
import Toolbar from '../../components/toolbar/toolbar';
import Collections from '../../components/collections/collections';

export default function CollectionsPage(props) {
  console.log(
    `In collectionsPage - props.location.state.userID = ${props.location.state.uploaderID}`
  );

  const displayMyProfile =
    localStorage.getItem('userID') == props.location.state.uploaderID
      ? true
      : false;

  return (
    <React.Fragment>
      <Toolbar />
      <Collections
        userID={props.location.state.uploaderID}
        displayMyProfile={displayMyProfile}
      />
    </React.Fragment>
  );
}
