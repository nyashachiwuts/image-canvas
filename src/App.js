import React from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import ImageUploading from "react-images-uploading";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const URLImage = ({ image }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
      draggable
    />
  );
};

const App = () => {
  const dragUrl = React.useRef();
  const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);
  const maxNumber = 10;
  const onChange = (imageList) => {
    setImages(imageList);
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-2">
      <div className="col-span-3 p-6">
        <h1 className="text-3xl font-bold mb-4">Image Canvas</h1>
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
          acceptType={["png"]}
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className="upload__image-wrapper">
              <button
                style={isDragging ? { color: "red" } : null}
                onClick={onImageUpload}
                {...dragProps}
                className="text-white text-md p-2 bg-[#1abc9c] rounded-sm"
              >
                Upload Images
              </button>
              &nbsp;
              <button
                onClick={onImageRemoveAll}
                className="text-white text-md p-2 bg-[#e74c3c] rounded-sm mb-6"
              >
                Remove Images
              </button>
              {imageList.map((image, index) => (
                <div key={index} className="flex flex-row mb-6">
                  <img
                    src={image.data_url}
                    alt=""
                    width="200"
                    draggable="true"
                    onDragStart={(e) => {
                      dragUrl.current = e.target.src;
                    }}
                  />
                  <div className="flex flex-col">
                    <button
                      onClick={() => onImageUpdate(index)}
                      className="flex flex-row bg-[#3498db] px-3 py-2"
                    >
                      <FaPencilAlt color="#fff" size={20} />
                      <span className="text-white ml-2">EDIT</span>
                    </button>
                    <button
                      onClick={() => onImageRemove(index)}
                      className="flex flex-row bg-[#e74c3c] px-3 py-2"
                    >
                      <FaTrash color="#fff" size={20} />
                      <span className="text-white ml-2">DELETE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>

      <div
        className="col-span-9"
        onDrop={(e) => {
          e.preventDefault();
          stageRef.current.setPointersPositions(e);
          setImages(
            images.concat([
              {
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
              },
            ])
          );
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
          className="bg-gray-400"
        >
          <Layer>
            {images.map((image, index) => {
              return (
                <URLImage
                  image={image}
                  key={index}
                  style={{ width: "100px" }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default App;
