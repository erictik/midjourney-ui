import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  List,
  Image,
  Typography,
  Skeleton,
  Modal,
  Tooltip,
} from "antd";
import { SendOutlined, ClearOutlined } from "@ant-design/icons";
import { Imagine, Custom, WaitMessage } from "../request";
import { MJMessage } from "midjourney";
import { Message } from "../interfaces/message";
import ImageCropperModal from "../components/ImageCropperModal";

const { TextArea } = Input;
const { Text } = Typography;

const Midjourney: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalValue, setCustomModalValue] = useState("");
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regionModalUrl, setRegionModalUrl] = useState("");
  const [regionId, setRegionId] = useState("");
  const [customModalContent, setCustomModalContent] = useState({
    content: "",
    msgID: "",
    flags: "",
    custom: "",
    label: "",
    prompt: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const localMessages = localStorage.getItem("messages");
    if (localMessages) {
      setMessages(JSON.parse(localMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleMessageSend = async () => {
    let newMessage: Message = {
      text: inputValue.trim(),
      prompt: inputValue.trim(),
      progress: "waiting start",
      img: "",
    };

    if (newMessage.text) {
      const oldMessages = messages;
      setLoading(true);
      setMessages([...oldMessages, newMessage]);
      await Imagine(
        JSON.stringify({ prompt: newMessage.text }),
        (data: MJMessage) => {
          console.log(data);
          newMessage.img = data.uri;
          newMessage.msgHash = data.hash;
          newMessage.msgID = data.id;
          newMessage.progress = data.progress;
          newMessage.content = data.content?.split(" - ")[0];
          newMessage.flags = data.flags;
          newMessage.options = data.options;
          setMessages([...oldMessages, newMessage]);
        }
      );
      setInputValue("");
      setLoading(false);
    }
  };

  const clickLabel = async (
    content: string,
    msgId: string,
    flags: string,
    customId: string,
    label: string,
    prompt?: string
  ) => {
    let newMessage: Message = {
      text: `${content} ${label}`,
      prompt,
      progress: "waiting start",
      img: "",
    };

    const oldMessages = messages;
    setLoading(true);
    setMessages([...oldMessages, newMessage]);
    await Custom(
      JSON.stringify({ content, msgId, flags, customId, label, prompt }),
      (data: MJMessage) => {
        newMessage.img = data.uri;
        newMessage.msgHash = data.hash;
        newMessage.msgID = data.id;
        newMessage.content = data.content?.split(" - ")[0];
        newMessage.progress = data.progress;
        newMessage.flags = data.flags;
        newMessage.options = data.options;
        setMessages([...oldMessages, newMessage]);
      }
    );
    setLoading(false);
  };

  const waitingMessage = async (
    content: string,
    label: string,
    prompt: string
  ) => {
    let newMessage: Message = {
      text: `${content} ${label}`,
      prompt,
      progress: "waiting start",
      img: "",
    };

    const oldMessages = messages;
    setLoading(true);
    setMessages([...oldMessages, newMessage]);
    await WaitMessage(
      JSON.stringify({ content: `[${prompt}]` }),
      (data: MJMessage) => {
        newMessage.img = data.uri;
        newMessage.msgHash = data.hash;
        newMessage.msgID = data.id;
        newMessage.content = data.content?.split(" - ")[0];
        newMessage.progress = data.progress;
        newMessage.flags = data.flags;
        newMessage.options = data.options;
        setMessages([...oldMessages, newMessage]);
      }
    );
    setLoading(false);
  };

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

    type MessageOption = {
      label: string;
      custom: string;
    };

    const clickHandler = (option: MessageOption) => {
      if (option.label === "Custom Zoom") {
        let newPrompt = prompt || "";
        if (!prompt?.includes("--ar")) {
          newPrompt = `${newPrompt} --ar 1:1`;
        }
        if (!prompt?.includes("--zoom")) {
          newPrompt = `${newPrompt} --zoom 2`;
        }
        setCustomModalValue(newPrompt);
        setCustomModalContent({
          content: String(content),
          msgID: String(msgID),
          flags: String(flags),
          custom: option.custom,
          label: option.label,
          prompt: newPrompt,
        });
        setIsCustomModalOpen(true);
      } else if (option.label === "Vary (Region)") {
        setLoading(true);
        fetch("/api/vary/", {
          method: "POST",
          body: JSON.stringify({
            msgId: String(msgID),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            const decodedUrl = decodeURIComponent(res.url);
            const url = new URL(decodedUrl);
            const searchParams = new URLSearchParams(url.search);
            const customId = searchParams.get("custom_id");
            setRegionId(customId?.replace("MJ::iframe::", "") || "");
            setCustomModalContent({
              content: String(content),
              msgID: String(msgID),
              flags: String(flags),
              custom: option.custom,
              label: option.label,
              prompt: prompt || "",
            });
            setRegionModalUrl(img);
            setIsRegionModalOpen(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        clickLabel(
          String(content),
          String(msgID),
          String(flags),
          option.custom,
          option.label,
          prompt
        );
      }
    };

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

        {img ? (
          <Image className="ml-2 rounded-xl" width={400} src={img} alt="" />
        ) : (
          <Skeleton.Image active />
        )}

        <div className="flex flex-wrap">
          {options &&
            options.map((option: MessageOption) => (
              <Button
                key={option.label}
                className="m-2"
                type="primary"
                loading={loading}
                onClick={() => clickHandler(option)}
              >
                {option.label}
              </Button>
            ))}
        </div>
      </List.Item>
    );
  };

  const handleVaryRegion = (mask: string) => {
    fetch("/api/vary-submit/", {
      method: "POST",
      body: JSON.stringify({
        customId: regionId,
        full_prompt: null,
        mask,
        prompt: customModalContent.prompt,
        userId: "0",
        username: "0",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        waitingMessage(
          customModalContent.content,
          customModalContent.label,
          customModalContent.prompt
        );
      })
      .finally(() => {
        setLoading(false);
        setIsRegionModalOpen(false);
      });
  };

  return (
    <>
      <div className="w-full mx-auto h-full flex flex-col border border-solid bg-sky-50 bg-opacity-30 border-sky-200 rounded-lg">
        <List
          style={{ height: "80vh" }}
          className="overflow-y-auto w-full px-4"
          dataSource={messages}
          renderItem={renderMessage}
        />
        <div className="flex-1 flex flex-col justify-around px-4 border-sky-200 border-0 border-t border-solid">
          <div>
            <Tooltip placement="top" title="Clear History">
              <Button
                type="primary"
                onClick={() => {
                  localStorage.clear();
                  setMessages([]);
                }}
                icon={<ClearOutlined />}
                shape="circle"
              />
            </Tooltip>
          </div>
          <div className="flex justify-between bg-white rounded-lg w-full">
            <TextArea
              disabled={loading}
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
              autoSize={{ minRows: 2, maxRows: 2 }}
              style={{ paddingRight: 30, border: "none" }}
            />
            <Button
              type="primary"
              onClick={handleMessageSend}
              loading={loading}
              icon={<SendOutlined />}
              title="Send"
              className="h-full"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      <Modal
        centered
        title="Custom Zoom Out"
        open={isCustomModalOpen}
        onOk={() => {
          clickLabel(
            customModalContent.content,
            customModalContent.msgID,
            customModalContent.flags,
            customModalContent.custom,
            customModalContent.label,
            customModalValue
          );
          setIsCustomModalOpen(false);
        }}
        okText="Submit"
        onCancel={() => setIsCustomModalOpen(false)}
      >
        <Text>ZOOM OUT WITH CUSTOM --AR AND --ZOOM</Text>
        <Input
          value={customModalValue}
          onChange={(e) => setCustomModalValue(e.target.value)}
        />
      </Modal>
      <ImageCropperModal
        open={isRegionModalOpen}
        onCancel={() => setIsRegionModalOpen(false)}
        imageUrl={regionModalUrl}
        submit={handleVaryRegion}
      />
    </>
  );
};

export default Midjourney;
