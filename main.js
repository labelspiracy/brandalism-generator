(function () {
    let canvasFabric;
    let textboxOne;
    let campaigns;
    let currentCampaign;

    function init() {
        canvasFabric = new fabric.Canvas('canvas');

        fetch(`campaigns.json?bust=${new Date()}`).then(res => res.json()).then(data => {
            campaigns = data;

            const isSetup = window.location.search.indexOf('setup') !== -1;
            const campaignParam = window.location.search.replace(/^.*?campaign\=/, '');

            currentCampaign = campaigns[campaignParam];

            if (isSetup) {
                document.body.classList.add('is-setup-view');
                initViewSetup();
            } else if (currentCampaign) {
                document.body.classList.add('is-create-view');
                initViewCreate();
            } else {
                document.body.classList.add('is-list-view');
                initViewList();
            }
        });
    }

    function initViewList() {
        const campaignList = document.getElementById('campaigns-list');

        Object.keys(campaigns).map(function (campaignId) {
            const campaign = campaigns[campaignId];

            campaignList.insertAdjacentHTML('afterbegin', `<li>
                <a href="?campaign=${campaignId}">
                    <img src="assets/${campaign.imageSource}" alt="${campaign.name}" />
                    <h4>${campaign.name}</h4>
                </a>
            </li>
            `);
        });
    }

    function initViewSetup() {
        document.getElementById('serialize').addEventListener('click', copyFabricToClipboard);
        document.getElementById('toggle-grid').addEventListener('click', toggleGridMarks);
        initControlView();
        initEditableFabric();
    }

    function initViewCreate() {
        initLoadedFabric();
        document.getElementById('download').addEventListener('click', downloadAsImage);
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
        const imageContainer = document.createElement('div');
        imageContainer.id = 'image-control';
        const controlImg = new Image();

        controlImg.src = `assets/${currentCampaign.imageSource}`;

        imageContainer.appendChild(controlImg);

        document.getElementById('draw-area').appendChild(imageContainer);
    }

    function initEditableFabric() {
        fabric.Image.fromURL(`assets/${currentCampaign.imageBase}`, function (img) {
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

        const myfont = new FontFaceObserver(currentCampaign.fonts);

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
                    fill: '#b1b2b6'
                });

                canvasFabric.add(textboxOne);
            });
    }

    function toggleGridMarks() {
        document.querySelector('.canvas-container').classList.toggle('grid-marks');
        document.getElementById('image-control').classList.toggle('grid-marks');
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