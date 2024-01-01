// components/FileUpload.js
import React, { useState } from 'react';
import { uploadPofileImg } from '../firebase/functions'
import { Button } from "@material-tailwind/react";

const FileUpload = ({setChanged, changedValue}:{setChanged:any, changedValue:any }) => {
  const [file, setFile] = useState(null);

  

  const handleFileChange = (event:any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && isFileTypeValid(selectedFile)) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid JPG or PNG file.');
    }
  };

  const handleUploadButtonClick = async () => {
    if (file) {
      try {
        await uploadPofileImg(file);
        setChanged(!changedValue)
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle the error as needed
      }
    }
  };

  const isFileTypeValid = (file:any) => {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return acceptedTypes.includes(file.type);
  };


  return (
    <div className="flex items-center p-4">
        
    <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} className="appearance-none bg-transparent border-none p-0 m-0 outline-none" />
    <Button color="blue-gray" variant="gradient" className="mr-2" onClick={handleUploadButtonClick}>
      Upload File
    </Button>
  </div>
  );
};

export default FileUpload;
