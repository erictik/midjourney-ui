import React, { useState } from 'react';
import { Input, Button, List ,Image} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { marked } from 'marked';
import { fetcherMidjourney } from '../request';
import { PageContainer } from '@ant-design/pro-components';
const { TextArea } = Input;

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageSend = async () => {
    const newMessage: Message = {
      text: inputValue.trim(),
      img: "",
      timestamp: new Date(),
    };
    if (!newMessage.text) {
      return;
    }
    const data = await fetcherMidjourney(JSON.stringify({ prompt: newMessage.text }));
    console.log({ data });
    if (data) {
      newMessage.img = data.img;
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const renderMessage = (message: Message) => {
    const html = marked(message.text);
    return (
      <List.Item>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <br />
        {message.img ??  <Image  width={200}  src={message.img} />}
        <small>{message.timestamp.toLocaleTimeString()}</small>
      </List.Item>
    );
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
          placeholder="Start typing your main idea..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          style={{ paddingRight: 30 }}
        />
        <Button
          type="primary"
          onClick={handleMessageSend}
          icon={<SendOutlined style={{ color: "#000" }} />}
          title='Send'
          style={{ position: 'absolute', bottom: 0, right: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}
        />
      </div>
    </div>
  );
};

export default Index;
