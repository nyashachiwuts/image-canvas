import React from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import ImageUploading from "react-images-uploading";

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
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <h1 className="text-3xl font-bold ">Image Canvas</h1>
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
            // write your building UI
            <div className="upload__image-wrapper">
              <button
                style={isDragging ? { color: "red" } : null}
                onClick={onImageUpload}
                {...dragProps}
                className="border border-black"
              >
                Click or Drop here
              </button>
              &nbsp;
              <button
                onClick={onImageRemoveAll}
                className="border border-black"
              >
                Remove all images
              </button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={image.data_url}
                    alt=""
                    width="200"
                    draggable="true"
                    onDragStart={(e) => {
                      dragUrl.current = e.target.src;
                    }}
                  />
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
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
          style={{ border: "1px solid grey" }}
          ref={stageRef}
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
