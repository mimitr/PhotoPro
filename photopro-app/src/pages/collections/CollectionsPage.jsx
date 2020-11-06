import React, { useState, useEffect } from "react";
import axios from "axios";
import Toolbar from "../../components/toolbar/toolbar";
import "./CollectionsPage.css";
import Collection from "./collection/Collection";

export default function CollectionsPage() {
  console.log("coll");
  return (
    <React.Fragment>
      <Toolbar />
      <div className="collectionsWrapper">
        <Collection />
      </div>
    </React.Fragment>
  );
}
