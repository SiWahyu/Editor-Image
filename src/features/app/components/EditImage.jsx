import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useState, useEffect, useRef, useMemo } from "react";
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
  Crop,
  RotateCw,
  MoveDown,
} from "lucide-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const randomStringCrypto = () => {
  return Math.random().toString(36).substring(2, 15);
};

const EditImage = ({ editImageRef }) => {
  const [imgSrc, setImageSrc] = useState(null);
  const [image] = useImage(imgSrc, "anonymous");

  const getStageSize = () => ({
    width: Math.min(window.innerWidth - 32, 800),
    height: Math.min(window.innerHeight * 0.5, 500),
  });
  const [stageSize, setStageSize] = useState(getStageSize());

  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const cacheTick = useRef();

  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blurRadius, setBlurRadius] = useState(0);
  const [noise, setNoise] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [luminance, setLuminance] = useState(0);
  const [value, setValue] = useState(0);
  const [activeFilter, setActiveFilter] = useState([]);
  const [rotation, setRotation] = useState(0);

  const activeFilters = useMemo(() => {
    const filters = [...activeFilter];
    if (brightness !== 0) filters.push(Konva.Filters.Brighten);
    if (contrast !== 0) filters.push(Konva.Filters.Contrast);
    if (blurRadius > 0) filters.push(Konva.Filters.Blur);
    if (hue !== 0 || saturation !== 0 || luminance !== 0)
      filters.push(Konva.Filters.HSL);
    if (noise > 0) filters.push(Konva.Filters.Noise);
    if (value !== 0) filters.push(Konva.Filters.HSV);
    return filters;
  }, [
    brightness,
    contrast,
    blurRadius,
    noise,
    hue,
    saturation,
    luminance,
    value,
    activeFilter,
  ]);

  //crop
  const [crop, setCrop] = useState({
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropConfig, setCropConfig] = useState(null);

  useEffect(() => {
    const handleResize = () => setStageSize(getStageSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (image) {
      setCropConfig({ x: 0, y: 0, width: image.width, height: image.height });
    }
  }, [image]);

  useEffect(() => {
    if (image && cropConfig) {
      const scaleX = stageSize.width / cropConfig.width;
      const scaleY = stageSize.height / cropConfig.height;
      const newScale = Math.min(scaleX, scaleY) * 0.9;
      setScale({ x: newScale, y: newScale });
    }
  }, [stageSize, image, cropConfig]);

  const applyCrop = () => {
    if (!completedCrop || !image) return;
    const imgElement = document.querySelector(".ReactCrop img");
    if (!imgElement) return;

    const ratioX = image.width / imgElement.width;
    const ratioY = image.height / imgElement.height;

    const newCrop = {
      x: completedCrop.x * ratioX,
      y: completedCrop.y * ratioY,
      width: completedCrop.width * ratioX,
      height: completedCrop.height * ratioY,
    };

    setCropConfig(newCrop);
    const scaleRatio =
      Math.min(
        stageSize.width / newCrop.width,
        stageSize.height / newCrop.height
      ) * 0.9;
    setScale({ x: scaleRatio, y: scaleRatio });
  };

  useEffect(() => {
    const handleResize = () => setStageSize(getStageSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (image) {
      setCropConfig({ x: 0, y: 0, width: image.width, height: image.height });
    }
  }, [image]);

  useEffect(() => {
    if (image && cropConfig) {
      const scaleX = stageSize.width / cropConfig.width;
      const scaleY = stageSize.height / cropConfig.height;
      const newScale = Math.min(scaleX, scaleY) * 0.9;
      setScale({ x: newScale, y: newScale });
    }
  }, [stageSize, image, cropConfig]);

  useEffect(() => {
    if (!imageRef.current) return;
    const applyFilters = () => {
      const node = imageRef.current;
      if (node) {
        node.clearCache();
        node.cache();
        node.getLayer().batchDraw();
      }
    };
    cancelAnimationFrame(cacheTick.current);
    cacheTick.current = requestAnimationFrame(applyFilters);
    return () => cancelAnimationFrame(cacheTick.current);
  }, [
    brightness,
    contrast,
    blurRadius,
    hue,
    saturation,
    activeFilter,
    cropConfig,
    luminance,
    value,
    noise,
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

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

  const resetAllFilters = () => {
    setBrightness(0);
    setContrast(0);
    setBlurRadius(0);
    setNoise(0);
    setHue(0);
    setSaturation(0);
    setRotation(0);
    setActiveFilter([]);
    setLuminance(0);
    setValue(0);
    if (image)
      setCropConfig({ x: 0, y: 0, width: image.width, height: image.height });
  };

  const tabsFinetune = useMemo(
    () => [
      {
        name: "Brightness",
        value: "brightness",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
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
              min={-1}
              max={1}
              step={0.01}
              className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
              onValueChange={(v) => setBrightness(v[0])}
            />
          </div>
        ),
      },
      {
        name: "Contrast",
        value: "contrast",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
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
              className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
              onValueChange={(v) => setContrast(v[0])}
            />
          </div>
        ),
      },
      {
        name: "Blur",
        value: "blur",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
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
              max={40}
              className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
              onValueChange={(v) => setBlurRadius(v[0])}
            />
          </div>
        ),
      },
      {
        name: "Noise",
        value: "noise",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
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
              className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
              onValueChange={(v) => setNoise(v[0])}
            />
          </div>
        ),
      },
      {
        name: "HSL/V",
        value: "hsv",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="text-xs font-bold opacity-50 uppercase">
              Hue, Saturation, Luminance & Value
            </div>
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-row justify-between items-center">
                <div className="font-medium text-sm">Hue</div>
                <Button variant="outline" size="sm" onClick={() => setHue(0)}>
                  Reset
                </Button>
              </div>
              <Slider
                value={[hue]}
                min={-259}
                max={259}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
                onValueChange={(v) => setHue(v[0])}
              />
            </div>
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-row justify-between items-center">
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
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
                onValueChange={(v) => setSaturation(v[0])}
              />
            </div>
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-row justify-between items-center">
                <div className="font-medium text-sm">Luminance</div>
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
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
                onValueChange={(v) => setLuminance(v[0])}
              />
            </div>
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-row justify-between items-center">
                <div className="font-medium text-sm">Value</div>
                <Button variant="outline" size="sm" onClick={() => setValue(0)}>
                  Reset
                </Button>
              </div>
              <Slider
                value={[value]}
                min={-2}
                max={2}
                step={0.1}
                className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
                onValueChange={(v) => setValue(v[0])}
              />
            </div>
          </div>
        ),
      },
    ],
    [brightness, contrast, blurRadius, noise, hue, saturation, value, luminance]
  );

  const tabsRotation = useMemo(
    () => [
      {
        name: "Flip",
        value: "flip",
        content: (
          <div className="flex flex-row justify-center gap-4 ">
            <Button variant="outline" onClick={toggleFlipHorizontal}>
              <FlipHorizontal2 className="mr-2 size-4" /> Horizontal
            </Button>
            <Button variant="outline" onClick={toggleFlipVertical}>
              <FlipVertical2 className="mr-2 size-4" /> Vertical
            </Button>
          </div>
        ),
      },
      {
        name: "Rotation",
        value: "rotation",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-center">
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
              value={[rotation]}
              className="[&>.relative]:bg-neutral-950/20 dark:bg-white/20 [&_.slider-track]:bg-transparent [&>.relative>span[data-orientation=horizontal]]:bg-transparent **:[[role=slider]]:relative [&_[role=slider]::after]:content-[attr(aria-valuenow)] [&_[role=slider]::after]:absolute [&_[role=slider]::after]:-top-6 [&_[role=slider]::after]:text-xs [&_[role=slider]::after]:font-semibold"
              onValueChange={(v) => setRotation(v[0])}
            />
          </div>
        ),
      },
    ],
    [rotation]
  );

  const filterPresetsContent = useMemo(() => {
    const presets = [
      { name: "Original", filter: [] },
      { name: "Grayscale", filter: [Konva.Filters.Grayscale] },
      { name: "Sepia", filter: [Konva.Filters.Sepia] },
      { name: "Invert", filter: [Konva.Filters.Invert] },
      { name: "Pixelate", filter: [Konva.Filters.Pixelate] },
    ];

    return (
      <div className="w-full py-4">
        <div
          className="flex flex-row gap-4 overflow-x-auto pb-4 px-2  [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {presets.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => setActiveFilter(item.filter)}
              onTouchEnd={() => setActiveFilter(item.filter)}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all bg-neutral-200 dark:bg-neutral-800">
                <Stage width={80} height={80}>
                  <Layer>
                    <KonvaImage
                      image={image}
                      scale={{
                        x: 80 / (image?.width || 1),
                        y: 80 / (image?.height || 1),
                      }}
                      filters={item.filter}
                      ref={(node) => {
                        if (node) {
                          node.cache();
                        }
                      }}
                    />
                  </Layer>
                </Stage>
              </div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [image]);

  const tabsFilter = useMemo(
    () => [
      {
        name: "Preset",
        value: "preset",
        content: (
          <div className="flex flex-row justify-center gap-4">
            {filterPresetsContent}
          </div>
        ),
      },
    ],
    [filterPresetsContent]
  );

  const tabsCrop = useMemo(
    () => (
      <div className="flex flex-col gap-4 p-2">
        <div
          className="overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 border rounded-lg bg-black/5"
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img src={imgSrc} alt="To Crop" className="max-w-full" />
          </ReactCrop>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white"
          onClick={applyCrop}
        >
          Apply Transformation
        </Button>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imgSrc, crop, completedCrop, stageSize]
  );

  const handleDownload = () => {
    if (!stageRef.current) return;

    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 1,
    });

    const link = document.createElement("a");
    link.download = randomStringCrypto() + ".png";
    link.href = dataURL;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      ref={editImageRef}
    >
      <input
        type="file"
        id="upload"
        hidden
        onChange={handleFileChange}
        accept="image/*"
      />
      {imgSrc ? (
        <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl p-6">
          <div className="flex justify-between mb-6">
            <Button
              onClick={() => document.getElementById("upload").click()}
              variant="secondary"
            >
              Change Image
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              Download PNG
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              <Button
                onClick={resetAllFilters}
                variant="default"
                className="w-full bg-transparent border text-red-500 border-red-600 hover:bg-red-700 hover:text-white"
              >
                Reset All
              </Button>
              <Tabs defaultValue="finetune">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="finetune">
                    <SlidersHorizontal size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="rotation">
                    <RotateCcw size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="filters">
                    <Blend size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="crop">
                    <Crop size={16} />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="finetune" className="py-4 space-y-6">
                  {tabsFinetune.map((t, i) => (
                    <div key={i}>{t.content}</div>
                  ))}
                </TabsContent>
                <TabsContent value="rotation" className="py-4 space-y-6">
                  {tabsRotation.map((t, i) => (
                    <div key={i}>{t.content}</div>
                  ))}
                </TabsContent>
                <TabsContent value="filters" className="py-4 space-y-6">
                  {tabsFilter.map((t, i) => (
                    <div key={i}>{t.content}</div>
                  ))}
                </TabsContent>
                <TabsContent value="crop">{tabsCrop}</TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-8 flex justify-center bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden p-4 order-1 lg:order-2">
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                ref={stageRef}
              >
                <Layer>
                  {image && (
                    <KonvaImage
                      ref={imageRef}
                      image={image}
                      scale={scale}
                      crop={cropConfig || undefined}
                      width={cropConfig?.width || image.width}
                      height={cropConfig?.height || image.height}
                      x={stageSize.width / 2}
                      y={stageSize.height / 2}
                      offsetX={(cropConfig?.width || image.width) / 2}
                      offsetY={(cropConfig?.height || image.height) / 2}
                      rotation={rotation}
                      filters={activeFilters}
                      brightness={brightness}
                      contrast={contrast}
                      blurRadius={blurRadius}
                      noise={noise}
                      luminance={luminance}
                      saturation={saturation}
                      hue={hue}
                      value={value}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-center justify-center items-center gap-4">
          <h2 className="text-2xl font-bold">Upload to Start</h2>
          <div className="">
            <MoveDown className="size-14" />
          </div>
          <div
            className="p-20 border-2 border-dashed rounded-3xl cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => document.getElementById("upload").click()}
          >
            <h2 className="text-2xl font-bold">Upload to Start</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditImage;
