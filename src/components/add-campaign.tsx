import { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import WebFont from "webfontloader";
import { useParams } from "react-router-dom";
import cn from "classnames";

import campaigns from "../campaigns";

function copyFabricToClipboard(fabricCanvas) {
    const fabricJSON = JSON.stringify(fabricCanvas);

    navigator.clipboard.writeText(fabricJSON).then(function () {
        console.log('copied to clipboard');
    }, function () {
        console.log('copy error');
    });
}

function initFabric(campaign, fabricCanvas) {
    const fontPromise = new Promise<void>(resolve => 
        WebFont.load({
            google: {
              families: campaign.fonts
            },
            active: function() {
                resolve();
            }
        })
    );

    fontPromise
        .then(function () {
            if (campaign.canvas) {
                fabricCanvas.loadFromJSON(campaign.canvas, function () {
                    const objects = fabricCanvas.getObjects();
                    const group = new fabric.Group(objects);

                    fabricCanvas.setWidth(group.width);
                    fabricCanvas.setHeight(group.height);
                });
            } else {
                fabric.Image.fromURL(campaign.imageBase.href, function (img) {
                    const campaignImageRatio = img.height / img.width;
                    const maxCampaignWidth = window.innerWidth / 3 < img.width ? window.innerWidth / 3 : img.width;
                    const maxCampaignHeight = maxCampaignWidth * campaignImageRatio;
            
                    img.scale(maxCampaignWidth / img.width);
                    img.set({
                        left: 0,
                        top: 0,
                        hasControls: false,
                        hasBorders: false,
                        selectable: false
                    });
            
                    fabricCanvas.add(img);
                    fabricCanvas.sendToBack(img);
                    fabricCanvas.setWidth(maxCampaignWidth);
                    fabricCanvas.setHeight(maxCampaignHeight);
                    fabricCanvas.calcOffset();
                });


                if (campaign.textNodes && campaign.textNodes.length) {
                    campaign.textNodes.forEach(node => {
                        fabricCanvas.add(new fabric.Textbox(node.text, {
                            left: 50,
                            top: 50,
                            width: 185,
                            ...campaign.defaultProperties,
                            ...node.properties
                        }));
                    });
                }
            }
        });
}

export default function AddCampaign() {
    const { campaignId } = useParams();
    const campaign = campaigns.find(campaign => campaign.id === campaignId);
    const [loadedCanvas, setLoadedCanvas] = useState(false);
    const [showGridMarks, toggleGridMarks] = useState(false);
    const [fabricCanvas, setFabricCanvas] = useState(null);
    
    let canvasEl = useRef(null);

    useEffect(() => {
        if (campaign && !loadedCanvas) {
            const newFabricCanvas = new fabric.Canvas(canvasEl.current);
            
            initFabric(campaign, newFabricCanvas);
            setFabricCanvas(newFabricCanvas);
            setLoadedCanvas(true);
        }
    }, [loadedCanvas]);

    return (
        <div>
            <div className="draw-area">
                <div className={cn({ 'with-grid-marks': showGridMarks })}>
                    <canvas 
                        ref={canvasEl}
                    ></canvas>
                </div>
                <div className={cn('image-source', { 'with-grid-marks': showGridMarks })}>
                    <img 
                        src={campaign.imageSource} 
                        alt={campaign.name} 
                    />
                </div>
            </div>
            <ul className="controls">
                <li>
                    <button 
                        type="button"
                        onClick={() => copyFabricToClipboard(fabricCanvas)}
                    >
                        export to clipboard
                    </button>
                </li>
                <li>
                    <button 
                        type="button"
                        onClick={() => toggleGridMarks(!showGridMarks)}
                    >
                        grid
                    </button>
                </li>
            </ul>
        </div>
    );
}