import React, { useState } from 'react';
import { Input, Button, List ,Image} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { marked } from 'marked';
import { MidjourneyAPi } from '../request';
import { MJMessage } from 'midjourney';


const { TextArea } = Input;


const ImgMessage: React.FC <Message>= ({text,timestamp}) => {
  const html = marked(text);
  // const [img, setImg] = useState('');
  console.log(text)
  // MidjourneyAPi(JSON.stringify({prompt:text}),(data :MJMessage)=>{
  //   setImg(data.uri)
  // })
  return (
    <List.Item>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <br />
      {/* {img ??  <Image  width={200}  src={img} />} */}
      <small>{timestamp.toLocaleTimeString()}</small>
    </List.Item>
  );
}

const renderMessage = ({text,timestamp,img}: Message) => {
  const html = marked(text);
  return (
    <List.Item>
    <div dangerouslySetInnerHTML={{ __html: html }} />
    <br />
     <Image  width={200}  src={img} />
    <small>{timestamp.toLocaleTimeString()}</small>
  </List.Item>
  );
};

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputDisable, setInputDisable] = useState(false);
  // let messages: Message[] = []
  
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageSend = async () => {
    let newMessage: Message = {
      text: inputValue.trim(),
      img: "",
      timestamp: new Date(),
    };
  
    if (newMessage.text) {
      const oldMessages = messages;
      setInputValue('');
      setInputDisable(true);
      setMessages([...oldMessages, newMessage]);
      console.log("newMessage.text")
      await MidjourneyAPi(JSON.stringify({prompt:newMessage.text}),(data :MJMessage)=>{
        console.log(data)
        newMessage.img = data.uri;
        setMessages([...oldMessages, newMessage]);
      })
      setInputDisable(false);
    }
  };



  return (
    <div>
        
      <List
        dataSource={messages}
        renderItem={renderMessage}
        style={{ height: 400, overflowY: 'scroll' }}
      />
      <div style={{ position: 'relative' }}>
        <TextArea
          disabled={inputDisable}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              setInputValue(`${inputValue}\n`);
              e.preventDefault();
            } else if (e.key === 'Enter') {
              handleMessageSend();
              e.preventDefault();
            }
          }}
          // size="large" 
          placeholder="Start typing your main idea..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          style={{ paddingRight: 30 }}
        />
        <Button
          type="primary"
          onClick={handleMessageSend}
          loading={inputDisable}
          icon={<SendOutlined style={{ color: "#000" }} />}
          title='Send'
          style={{ position: 'absolute', bottom: 0, right: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}
        />
      </div>
    </div>
  );
};

export default Index;
function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
  throw new Error('Function not implemented.');
}

