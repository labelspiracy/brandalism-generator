import { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import WebFont from "webfontloader";
import { useParams } from "react-router-dom";

import campaigns from "../campaigns";

function initLoadedFabric(campaign, fabricCanvas) {
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
    
    fabricCanvas.setWidth(campaign.width);
    fabricCanvas.setHeight(campaign.height);
    fabricCanvas.calcOffset();

    fontPromise
        .then(function () {
            fabricCanvas.loadFromJSON(campaign.canvas, function () {
                const objects = fabricCanvas.getObjects();
                const group = new fabric.Group(objects);

                fabricCanvas.setWidth(group.width);
                fabricCanvas.setHeight(group.height);

                group.destroy();

                objects.forEach(obj => {
                    if (obj.type === 'textbox') {
                        obj.set({
                            lockMovementY: true,
                            lockMovementX: true,
                            hasControls: false,
                            selectable: true
                        });
                    }

                    if (obj.type === 'image') {
                        obj.set({
                            hasControls: false,
                            hasBorders: false,
                            selectable: false
                        });
                    }
                });

                fabricCanvas.requestRenderAll();
            });
        });
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function downloadAsImage(event, fabricCanvas, campaign) {
    event.preventDefault();

    const link = document.createElement("a");
    const imgData = fabricCanvas.toDataURL({
        format: 'jpeg',
        multiplier: 2
    });

    const blob = dataURLtoBlob(imgData);
    const objurl = URL.createObjectURL(blob);

    link.download = `${campaign.name}.jpg`;
    link.href = objurl;        
    link.click();
}

export default function EditCampaign() {
    const { campaignId } = useParams();
    const campaign = campaigns.find(campaign => campaign.id === campaignId);
    const [loadedCanvas, setLoadedCanvas] = useState(false);
    const [fabricCanvas, setFabricCanvas] = useState(null);
    
    let canvasEl = useRef(null);

    useEffect(() => {
        if (campaign && !loadedCanvas) {
            const newFabricCanvas = new fabric.Canvas(canvasEl.current);
            initLoadedFabric(campaign, newFabricCanvas);

            setFabricCanvas(newFabricCanvas);
            setLoadedCanvas(true);
        }
    }, [loadedCanvas]);

    return (
        <div>
            <div className="draw-area">
                <canvas ref={canvasEl}></canvas>
            </div>
            <ul className="controls">
                <li>
                    <button 
                        type="button"
                        onClick={event => downloadAsImage(event, fabricCanvas, campaign)}
                    >
                        download
                    </button>
                </li>
            </ul>
        </div>
    );
}