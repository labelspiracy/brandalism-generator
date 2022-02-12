function copyFabricToClipboard() {
    const fabricJSON = JSON.stringify(canvasFabric);

    navigator.clipboard.writeText(fabricJSON).then(function () {
        console.log('copied to clipboard');
    }, function () {
        console.log('copy error');
    });
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

    var observers = [];

    // Make one observer for each font,
    // by iterating over the data we already have
    currentCampaign.fonts.forEach(function(family) {
        var obs = new FontFaceObserver(family);
        observers.push(obs.load());
    });

    Promise.all(observers)
        .then(function () {
            textboxOne = new fabric.Textbox("IF YOUR BANK FINANCES ARCTIC DRILLING", {
                left: 50,
                top: 50,
                width: 185,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 0.85,
                textAlign: 'right',
                fontFamily: 'BenchNine',
                fill: '#000'
            });

            canvasFabric.add(textboxOne);

            textboxTwo = new fabric.Textbox("SO DO YOU", {
                left: 50,
                top: 50,
                width: 185,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 0.85,
                textAlign: 'right',
                fontFamily: 'BenchNine',
                fill: '#018754'
            });

            canvasFabric.add(textboxTwo);

            textboxThree = new fabric.Textbox("The bank for a changing world", {
                right: 10,
                top: 50,
                width: 205,
                fontSize: 14,
                fontWeight: 100,
                lineHeight: 0.85,
                textAlign: 'right',
                fontFamily: 'BNPP Sans',
                fill: '#000'
            });

            canvasFabric.add(textboxThree);
        });
}

export default function SetupCampaign(props) {
    return (
        <div>
            <div className="draw-area" id="draw-area">
                <canvas id="canvas"></canvas>
            </div>
            <ul className="controls">
                <li>
                    <button type="button">
                        export to clipboard
                    </button>
                </li>
                <li>
                    <button type="button">
                        grid
                    </button>
                </li>
            </ul>
        </div>
    );
}