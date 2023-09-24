import React, { useState } from "react";
import { Input, Button, List, Image, Typography, Skeleton } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Imagine, Custom } from "../request";
import { MJMessage } from "midjourney";
import { Message } from "../interfaces/message";

const { TextArea } = Input;
const { Text } = Typography;

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputDisable, setInputDisable] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageSend = async () => {
    let newMessage: Message = {
      text: inputValue.trim(),
      prompt: inputValue.trim(),
      progress: "waiting start",
      img: "",
    };

    if (newMessage.text) {
      const oldMessages = messages;
      setInputDisable(true);
      setMessages([...oldMessages, newMessage]);
      await Imagine(
        JSON.stringify({ prompt: newMessage.text }),
        (data: MJMessage) => {
          console.log(data);
          newMessage.img = data.uri;
          newMessage.msgHash = data.hash;
          newMessage.msgID = data.id;
          newMessage.progress = data.progress;
          newMessage.content = data.content;
          newMessage.flags = data.flags;
          newMessage.options = data.options;
          setMessages([...oldMessages, newMessage]);
        }
      );
      setInputValue("");
      setInputDisable(false);
    }
  };

  const clickLabel = async (content: string, msgId: string, flags: string, customId: string, label: string, prompt?: string) => {
    let newMessage: Message = {
      text: `${content} ${label}`,
      prompt,
      progress: "waiting start",
      img: "",
    };

    const oldMessages = messages;
    setInputDisable(true);
    setMessages([...oldMessages, newMessage]);
    await Custom(
      JSON.stringify({ content, msgId, flags, customId, label }),
      (data: MJMessage) => {
        newMessage.img = data.uri;
        newMessage.msgHash = data.hash;
        newMessage.msgID = data.id;
        newMessage.content = data.content;
        newMessage.progress = data.progress;
        newMessage.flags = data.flags;
        newMessage.options = data.options;
        setMessages([...oldMessages, newMessage]);
      }
    );
    setInputDisable(false);
  }
  const renderMessage = ({
    text,
    img,
    flags,
    msgID,
    progress,
    content,
    options,
    prompt,
  }: Message) => {
    if (process.env.NEXT_PUBLIC_IMAGE_PREFIX) {
      img = img.replace(
        "https://cdn.discordapp.com/",
        process.env.NEXT_PUBLIC_IMAGE_PREFIX
      );
    }
    return (
      <List.Item
        className="flex flex-col space-y-4 justify-start items-start"
        style={{
          alignItems: "flex-start",
        }}
      >
        <Text>
          {text} {`(${progress})`}
        </Text>

        {
          img ? (
            <Image className="ml-2 rounded-xl" width={400} src={img} alt="" />
          ) : (
            <Skeleton.Image active />
          )
        }

        <div className="flex flex-wrap">
        {
          options && options.map(option => (
            <Button
              key={option.label}
              className="m-2"
              type="primary"
              disabled={["Vary (Region)","Custom Zoom"].indexOf(option.label) > -1}
              onClick={() => {
                clickLabel(
                  String(content),
                  String(msgID),
                  String(flags),
                  option.custom,
                  option.label,
                  prompt,
                );
              }}
            >
              {option.label}
            </Button>
          ))
        }
        </div>
      </List.Item>
    );
  };

  return (
    <div className="w-full mx-auto px-4 h-full relative">
      <List
          style={{
              height: "calc(100vh - 96px)",
          }}
          className="overflow-y-auto w-full"
          dataSource={messages}
          renderItem={renderMessage}
      />
      <div className="absolute z-10 w-3/4 xl:w-3/5 right-0 bottom-10 left-0 mx-auto">
        <TextArea
          className="w-full"
          disabled={inputDisable}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              setInputValue(`${inputValue}\n`);
              e.preventDefault();
            } else if (e.key === "Enter") {
              handleMessageSend();
              e.preventDefault();
            }
          }}
          placeholder="Start typing your main idea..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          style={{ paddingRight: 30 }}
        />
        <Button
          className="absolute"
          type="primary"
          onClick={handleMessageSend}
          loading={inputDisable}
          icon={<SendOutlined style={{ color: "#000" }} />}
          title="Send"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />
      </div>
    </div>
  );
};

export default Index;
