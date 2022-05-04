import React, {useState, useEffect} from "react";
import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';


export default function VideoInput(props) {
  const { width, height, videoFileData } = props;

  const inputRef = React.useRef();

  const [source, setSource] = React.useState();


  useEffect(() => {
    if(!['', undefined, null].includes(videoFileData)) {
        setSource(props.videoFileData)
    }

  }, [])    

  const handleFileChange = (event) => {

      console.log('event.target.files[0]' , event.target.files[0])
      // accept="image/png, image/gif, image/jpeg ,image/jpg , image/webp , image/apng"
      
		if(event.target.files[0].type === "image/png" || event.target.files[0].type === "image/gif" || event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/webp" || event.target.files[0].type === "application/msword" || event.target.files[0].type === "application/zip" ||event.target.files[0].type === "application/pdf" ||event.target.files[0].type === "application/vnd.ms-excel" ||event.target.files[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||event.target.files[0].type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ){
		 message.error('This type file not supported', 5);
      inputRef.current.value = "";
      return  

		}

    let fileSize = event.target.files[0].size / 1024 /1024;

    if(fileSize > 1) {
      setSource('')
         notification.error({message: "File size exceeds 1 MB"});
        //  inputRef.current.reset();
         inputRef.current.value = "";

      return ;
    }

    const file = event.target.files[0];
    props.videoFile(file);
    const url = URL.createObjectURL(file);
    setSource(url);
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };

  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
      />
      
      {source && (
        <video
								className="VideoInput_video"
								width="400%"
								height="400px"
								controls
								src={source}
								/>

        
      )}
      {/* <div className="VideoInput_footer">{source || "Nothing selectd"}</div> */}
    </div>
  );
}
