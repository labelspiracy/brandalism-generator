(function () {
    let canvasFabric;
    let textboxOne;
    let campaigns;
    let currentCampaign;

    function init() {
        fetch(`campaigns.json?bust=${new Date()}`).then(res => res.json()).then(data => {
            campaigns = data;

            const campaignParam = window.location.search.replace(/^.*?campaign\=/, '');
            currentCampaign = campaigns[campaignParam];

            initFabric();
            initControls();
        });
    }

    function initControls() {

        if (!currentCampaign) {
            document.getElementById('serialize').addEventListener('click', copyFabricToClipboard);
            document.getElementById('controls').classList.add('is-editable');
        } else {
            document.getElementById('download').addEventListener('click', downloadAsImage);
        }
    }

    function initFabric() {
        canvasFabric = new fabric.Canvas('canvas');

        if (currentCampaign) {
            initLoadedFabric();
        } else {
            initControlView();
            initEditableFabric();
        }
    }

    function initLoadedFabric() {
        const myfont = new FontFaceObserver(currentCampaign.fonts);

        canvasFabric.setWidth(currentCampaign.width);
        canvasFabric.setHeight(currentCampaign.height);
        canvasFabric.calcOffset();

        myfont.load()
            .then(function () {
                canvasFabric.loadFromJSON(currentCampaign.canvas, function () {
                    const objects = canvasFabric.getObjects();

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

                    canvasFabric.requestRenderAll();
                });
            });
    }

    function initControlView() {
        const controlImg = new Image();

        controlImg.src = "assets/credit-mutuel-01-control.jpg";
        document.getElementById('draw-area').appendChild(controlImg);
    }

    function initEditableFabric() {
        const isEditable = window.location.search.indexOf('edit') !== -1;

        fabric.Image.fromURL('assets/credit-mutuel-01.jpg', function (img) {
            img.set({
                left: 0,
                top: 0,
                hasControls: false,
                hasBorders: false,
                selectable: false
            });

            canvasFabric.add(img);
            canvasFabric.sendToBack(img);
            canvasFabric.setWidth(img.width);
            canvasFabric.setHeight(img.height);
            canvasFabric.calcOffset();
        });

        const myfont = new FontFaceObserver('Open Sans');

        myfont.load()
            .then(function () {
                textboxOne = new fabric.Textbox("Moins d'encre sur notre carte blanche en plastique recyclé, c'est tout simple mais c'est surtout plus écologique.", {
                    left: 50,
                    top: 50,
                    width: 185,
                    fontSize: 18,
                    lineHeight: 0.85,
                    textAlign: 'center',
                    fontFamily: 'Open Sans',
                    fill: '#b1b2b6',
                    hoverCursor: isEditable ? 'cross' : 'text',
                    lockMovementY: !isEditable,
                    lockMovementX: !isEditable,
                    hasControls: isEditable,
                    hasBorders: isEditable,
                    editable: true,
                    selectable: true
                });

                canvasFabric.add(textboxOne);
            });
    }

    function copyFabricToClipboard() {
        const fabricJSON = JSON.stringify(canvasFabric);

        navigator.clipboard.writeText(fabricJSON).then(function () {
            console.log('copied to clipboard');
        }, function () {
            console.log('copy error');
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

    function downloadAsImage(event) {
        event.preventDefault();

        var link = document.createElement("a");
        var imgData = canvasFabric.toDataURL({
            format: 'jpeg',
            multiplier: 2
        });

        var blob = dataURLtoBlob(imgData);
        var objurl = URL.createObjectURL(blob);

        link.download = `${currentCampaign.name}.jpg`;

        link.href = objurl;

        link.click();
    }

    window.addEventListener('load', init);
}());