import React, { useState, useEffect } from 'react'

export default function UploadImage({imageUrl, setImageUrl}) {
    const [image, setImage] = useState();

    useEffect(() => {
        if (image === undefined) return;
        const newImageUrl = URL.createObjectURL(image)
        setImageUrl(newImageUrl)
    }, [image])

    function onImageChange(e) {
        setImage(...e.target.files)
    }

    return (
        <div>
            <input type='file' accept='image' onChange={onImageChange}></input>
        </div>
    )
}
