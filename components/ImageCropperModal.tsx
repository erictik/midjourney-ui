import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";

interface ImageCropperProps {
  imageUrl: string; // 父组件传入的图片URL
  open: boolean; // 父组件传入的是否打开的状态
  onCancel: () => void; // 父组件传入的关闭弹窗的方法
  submit: (base64ImageData: string) => void; // 父组件传入的提交图片的方法
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  open,
  onCancel,
  submit,
}) => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [endY, setEndY] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (imageUrl) {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctxRef.current = ctx;
        }
      }

      // 在组件挂载后加载父组件传入的图片
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        if (ctxRef.current) {
          ctxRef.current.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
          canvasRef.current!.width = img.width;
          canvasRef.current!.height = img.height;
          ctxRef.current.drawImage(img, 0, 0, img.width, img.height);
        }
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    setIsDragging(false);
  }, [open]);

  const drawOriginalImage = () => {
    if (ctxRef.current && originalImage) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      ctxRef.current.drawImage(
        originalImage,
        0,
        0,
        originalImage.width,
        originalImage.height
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const startX =
        (e.clientX - rect.left) * (originalImage!.width / rect.width);
      const startY =
        (e.clientY - rect.top) * (originalImage!.height / rect.height);
      setStartX(startX);
      setStartY(startY);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const endX =
        (e.clientX - rect.left) * (originalImage!.width / rect.width);
      const endY =
        (e.clientY - rect.top) * (originalImage!.height / rect.height);
      if (ctxRef.current) {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        drawOriginalImage();
        ctxRef.current.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctxRef.current.fillRect(
          startX,
          startY,
          endX ? endX - startX : 0,
          endY ? endY - startY : 0
        );
      }
      setEndX(endX);
      setEndY(endY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropAndConvert = () => {
    if (ctxRef.current && originalImage) {
      const x = startX;
      const y = startY;
      const width = endX - startX;
      const height = endY - startY;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = originalImage.width;
      tempCanvas.height = originalImage.height;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        tempCtx.fillStyle = "#000";
        tempCtx.fillRect(0, 0, originalImage.width, originalImage.height);

        tempCtx.clearRect(x, y, width, height);
        tempCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
        tempCtx.fillRect(x, y, width, height);

        const base64ImageData = tempCanvas.toDataURL("image/webp");

        submit(base64ImageData.split(",")[1]);
      }
    }
  };

  return (
    <Modal
      okText="Submit"
      onCancel={onCancel}
      open={open}
      title="Vary Region"
      onOk={handleCropAndConvert}
      centered
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          border: "1px solid #000",
          cursor: "crosshair",
          maxWidth: "100%",
          maxHeight: "70vh",
        }}
      ></canvas>
    </Modal>
  );
};

export default ImageCropper;
