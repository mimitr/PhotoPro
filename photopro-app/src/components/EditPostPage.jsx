import React, { useState, useEffect } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";

export default function EditPostPage(){

    const [caption, set_caption] = useState("");

    function validate_caption() {
        return caption.length > 0 && caption.length < 50;
    }

    async function edit_post(event){
        event.preventDefault()

        var response = await axios.get("http://localhost:5000/edit_post",
        {
            params: {image_id: image_id, caption: caption}
        });
        console.log(response);
    }
    //TODO: Find a way to extract image_id from an image
    //To test, replace 'image_id' with any valid image_id from the database

    return(
        <div>
            <form onSubmit={edit_post}>
                <FormGroup controlId="caption" bsSize="large">
                    <FormLabel>
                        Caption
                    </FormLabel>
                    <FormControl
                        Type="caption"
                        value={caption}
                        onChange={e => set_caption(e.target.value)}
                    />
                </FormGroup>

                <Button variant="primary"
                        disabled={!validate_caption()}
                        type="submit"
                >
                    Submit
                </Button>
            </form>
        </div>




    );



}