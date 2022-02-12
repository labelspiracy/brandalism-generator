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

    function initControlView() {
        const imageContainer = document.createElement('div');
        imageContainer.id = 'image-control';
        const controlImg = new Image();

        controlImg.src = `assets/${currentCampaign.imageSource}`;

        imageContainer.appendChild(controlImg);

        document.getElementById('draw-area').appendChild(imageContainer);
    }


    function toggleGridMarks() {
        document.querySelector('.canvas-container').classList.toggle('grid-marks');
        document.getElementById('image-control').classList.toggle('grid-marks');
    }

    window.addEventListener('load', init);
}());