import React from 'react';
import LockIcon from '@material-ui/icons/Lock';

import './Collection.css';

export default function Collection(props) {
  const handleCollectionClicked = () => {
    props.setCollectionClicked(true);
    props.setCollectionIdClicked(props.collection.collection_id);
    props.setCollectionNameClicked(props.collection.collection_name);
    props.setCollectionPrivateClicked(props.collection.private);
    props.setCollectionNumPhotosClicked(props.collection.num_photos);
    props.setCollectionCreatorClicked(props.collection.creator_id);
  };

  return (
    <React.Fragment>
      <div className="collection-box" onClick={handleCollectionClicked}>
        {props.collection.private === true ? <LockIcon /> : null}
        {props.collection.collection_name}
      </div>
    </React.Fragment>
  );
}
