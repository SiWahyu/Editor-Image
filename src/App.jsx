/* eslint-disable no-unused-vars */
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useState, useEffect, useRef } from "react";
import useImage from "use-image";
import Konva from "konva";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  SlidersHorizontal,
  Blend,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
} from "lucide-react";

import { Navbar } from "./components/Navbar";
import randomStringCrypto from "./utils/randomStringCrypto";

const App = () => {
  const [imgSrc, setImageSrc] = useState(null);

  const [image] = useImage(imgSrc, "anonymous");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const imageRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (image) {
      const scaleX = 800 / image.width;
      const scaleY = 500 / image.height;

      const finalScale = Math.min(scaleX, scaleY);

      // eslint-disable-next-line react-hooks/immutability
      setScale({ x: finalScale, y: finalScale });
    }
  }, [image]);

  useEffect(() => {
    if (image && imageRef.current) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [image]);

  useEffect(() => {
    if (image && imageRef.current) {
      imageRef.current.cache();
    }
  }, [image]);

  const [scale, setScale] = useState({ x: 1, y: 1 });

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blurRadius, setBlurRadius] = useState(0);
  const [noise, setNoise] = useState(0);

  // hsl dan hsv
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [luminance, setLuminance] = useState(0);
  const [value, setValue] = useState(0);
  const [activeFilter, setActiveFilter] = useState([]);

  const [rotation, setRotation] = useState(0);

  const toggleFlipHorizontal = () => {
    const node = imageRef.current;
    node.scaleX(node.scaleX() * -1);
    node.getLayer().batchDraw();
  };

  const toggleFlipVertical = () => {
    const node = imageRef.current;
    node.scaleY(node.scaleY() * -1);
    node.getLayer().batchDraw();
  };

  const tabsFinetune = [
    {
      name: "Brightness",
      value: "brightness",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <div className="font-medium text-sm">Brightness</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBrightness(0)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[brightness]}
                min={-1.5}
                max={1.5}
                step={0.01}
                onValueChange={(v) => setBrightness(v[0])}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
              />
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">
                  -1.5
                </span>
                <span className="text-foreground font-semibold">
                  {brightness}
                </span>
                <span className="text-foreground font-semibold">1.5</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Contrast",
      value: "contrast",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <div className="font-medium text-sm">Contrast</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContrast(0)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[contrast]}
                min={-100}
                max={100}
                step={1}
                onValueChange={(v) => setContrast(v[0])}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
              />
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">-50</span>
                <span className="text-foreground font-semibold">
                  {contrast}
                </span>
                <span className="text-foreground font-semibold">50</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Blur",
      value: "blur",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <div className="font-medium text-sm">Blur</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBlurRadius(0)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[blurRadius]}
                min={0}
                max={50}
                step={1}
                onValueChange={(v) => setBlurRadius(v[0])}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
              />
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">0</span>
                <span className="text-foreground font-semibold">
                  {blurRadius}
                </span>
                <span className="text-foreground font-semibold">50</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Noise",
      value: "noise",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <div className="font-medium text-sm">Noise</div>
                <Button variant="outline" size="sm" onClick={() => setNoise(0)}>
                  Reset
                </Button>
              </div>
              <Slider
                value={[noise]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(v) => setNoise(v[0])}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
              />
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">0</span>
                <span className="text-foreground font-semibold">{noise}</span>
                <span className="text-foreground font-semibold">1</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      name: "HSL",
      value: "hsl",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm">Hue</div>
                  <Button variant="outline" size="sm" onClick={() => setHue(0)}>
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[hue]}
                  min={-259}
                  max={259}
                  step={1}
                  onValueChange={(v) => setHue(v[0])}
                  className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm">Saturation</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSaturation(0)}
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[saturation]}
                  min={-2}
                  max={10}
                  step={0.1}
                  onValueChange={(v) => setSaturation(v[0])}
                  className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm">Lumince</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLuminance(0)}
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[luminance]}
                  min={-2}
                  max={2}
                  step={0.1}
                  onValueChange={(v) => setLuminance(v[0])}
                  className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">-2</span>
                <span className="text-foreground font-semibold">
                  {luminance}
                </span>
                <span className="text-foreground font-semibold">10</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      name: "HSV",
      value: "hsv",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm">Hue</div>
                  <Button variant="outline" size="sm" onClick={() => setHue(0)}>
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[hue]}
                  min={-259}
                  max={259}
                  step={1}
                  onValueChange={(v) => setHue(v[0])}
                  className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm">Saturation</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSaturation(0)}
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[saturation]}
                  min={-2}
                  max={10}
                  step={0.1}
                  onValueChange={(v) => setSaturation(v[0])}
                  className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm">Value</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setValue(0)}
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[value]}
                  min={-2}
                  max={2}
                  step={0.1}
                  onValueChange={(v) => setValue(v[0])}
                  className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">-2</span>
                <span className="text-foreground font-semibold">{value}</span>
                <span className="text-foreground font-semibold">10</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];
  const tabsRotation = [
    {
      name: "Flip",
      value: "flip",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="font-medium text-sm text-center">Flip</div>
              <div className="flex flex-row justify-center gap-4">
                <button
                  onClick={toggleFlipHorizontal}
                  className="flex gap-1 items-center border px-3 py-0.5 text-sm border-white rounded-lg"
                >
                  <FlipHorizontal2 className="size-4" />
                  <span>Flip Horizontal </span>
                </button>
                <button
                  onClick={toggleFlipVertical}
                  className="flex gap-1 items-center border px-3 py-0.5 text-sm border-white rounded-lg"
                >
                  <FlipVertical2 className="size-4" />
                  <span>Flip Vertical </span>
                </button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Rotation",
      value: "rotation",
      content: (
        <>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <div className="font-medium text-sm">Rotation</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(0)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                min={0}
                max={360}
                step={1}
                value={[rotation]}
                onValueChange={(v) => {
                  setRotation(v[0]);
                  imageRef.current.rotation(v[0]);
                  imageRef.current.getLayer().batchDraw();
                }}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent
  "
              />
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-semibold -ml-1">0</span>
                <span className="text-foreground font-semibold">
                  {contrast}
                </span>
                <span className="text-foreground font-semibold">360</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];
  const sideTabs = [
    {
      name: "Finetune",
      value: "finetune",
      icon: SlidersHorizontal,
      content: (
        <>
          <div className="w-full px-6 pb-4">
            <Tabs defaultValue="brightness">
              {tabsFinetune.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:animate-fade-in "
                >
                  <div className="min-h-[100px] flex items-center">
                    {tab.content}
                  </div>
                </TabsContent>
              ))}
              <div className="flex justify-center items-center">
                <TabsList className="gap-2">
                  {tabsFinetune.map((tab) => (
                    <TabsTrigger
                      className="px-4 py-4 rounded-xl border-none shadow-none data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-input dark:data-[state=active]:text-foreground"
                      key={tab.value}
                      value={tab.value}
                    >
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </>
      ),
    },
    {
      name: "Filters",
      value: "filters",
      icon: Blend,
      content: (
        <>
          <div className="w-full py-5.5">
            <div className="flex flex-row justify-center gap-3 px-3 py-2">
              {[
                { name: "Default", filter: [] },
                { name: "Grayscale", filter: [Konva.Filters.Grayscale] },
                { name: "Sepia", filter: [Konva.Filters.Sepia] },
                { name: "Invert", filter: [Konva.Filters.Invert] },
                { name: "Pixel", filter: [Konva.Filters.Pixelate] },
              ].map(({ name, filter }) => (
                <div className="flex flex-col" key={name}>
                  <Stage width={80} height={80}>
                    <Layer>
                      <KonvaImage
                        image={image}
                        scale={{ x: 0.1, y: 0.1 }}
                        filters={filter}
                        ref={(node) => {
                          if (node) {
                            node.cache();
                            node.getLayer()?.batchDraw();
                          }
                        }}
                        onTap={() => setActiveFilter(filter)}
                        onClick={() => setActiveFilter(filter)}
                      />
                    </Layer>
                  </Stage>
                  <div className="text-center mt-1 text-xs font-medium">
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Rotate",
      value: "rotate",
      icon: RotateCcw,
      content: (
        <>
          <div className="w-full px-6 pb-4">
            <Tabs defaultValue="flip">
              {tabsRotation.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:animate-fade-in "
                >
                  <div className="min-h-[100px] flex items-center">
                    {tab.content}
                  </div>
                </TabsContent>
              ))}
              <div className="flex justify-center items-center">
                <TabsList className="gap-2">
                  {tabsRotation.map((tab) => (
                    <TabsTrigger
                      className="px-4 py-4 rounded-xl border-none shadow-none data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-input dark:data-[state=active]:text-foreground"
                      key={tab.value}
                      value={tab.value}
                    >
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </>
      ),
    },
  ];

  const handleSaveImage = () => {
    if (!stageRef.current) return;

    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType: "image/png",
    });

    const link = document.createElement("a");
    link.download = randomStringCrypto() + ".png";
    link.href = dataURL;
    link.click();
  };

  return (
    <>
      <div className="relative w-full overflow-x-hidden dark:bg-neutral-800">
        <Navbar />
        <div className="w-screen h-screen flex items-center justify-center overflow-y-hidden overflow-x-hidden">
          {imgSrc ? (
            <div className="w-fit dark:bg-neutral-900 rounded-md pt-3">
              <div className="flex justify-end mx-8">
                <Button onClick={handleSaveImage} variant="outline">
                  Save
                </Button>
              </div>
              <Tabs defaultValue="finetune" className="gap-3 flex-row">
                <TabsList className="h-full flex-col p-0 my-4 mx-2">
                  {sideTabs.map(({ icon: Icon, name, value }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="flex flex-col items-center gap-1 py-3 px-3 sm:px-3 border-none shadow-none data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-input dark:data-[state=active]:text-foreground text-[15px] font-semibold"
                    >
                      <Icon className="size-5" />
                      {name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex flex-col">
                  <Stage
                    width={800}
                    height={500}
                    className="p-3 rounded-lg"
                    ref={stageRef}
                  >
                    <Layer>
                      <KonvaImage
                        ref={imageRef}
                        image={image}
                        scale={scale}
                        x={800 / 2}
                        y={500 / 2}
                        offsetX={image?.width / 2}
                        offsetY={image?.height / 2}
                        filters={[
                          ...activeFilter,
                          Konva.Filters.Brighten,
                          Konva.Filters.Contrast,
                          Konva.Filters.Blur,
                          Konva.Filters.Noise,
                          Konva.Filters.HSL,
                          Konva.Filters.HSV,
                        ]}
                        brightness={brightness}
                        contrast={contrast}
                        blurRadius={blurRadius}
                        noise={noise}
                        hue={hue}
                        value={value}
                        saturation={saturation}
                        luminance={luminance}
                        rotation={rotation}
                      />
                    </Layer>
                  </Stage>
                  {sideTabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                      {tab.content}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center w-md">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border dark:bg-white/10 rounded-xl "
              >
                <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
