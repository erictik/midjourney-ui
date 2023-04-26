import React, { useState } from 'react';
import { Input, Button, List } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { marked } from 'marked';

const { TextArea } = Input;

interface Message {
  text: string;
  timestamp: Date;
}

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageSend = () => {
    const newMessage: Message = {
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    if (newMessage.text) {
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
        <small>{message.timestamp.toLocaleTimeString()}</small>
      </List.Item>
    );
  };

  return (
    <div>
      <List
        dataSource={messages}
        renderItem={renderMessage}
        style={{ height: 400, overflowY: 'scroll' ,maxWidth: '36rem'}}
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
          icon={<SendOutlined style={{color: "#000"}} />}
          title='Send'
          style={{ position: 'absolute', bottom: 0, right: 0 ,background: 'transparent', border: 'none', boxShadow: 'none'}}
        />
      </div>
    </div>
  );
};

export default Index;
