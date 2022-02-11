export default function EditCampaign(props) {
    return (
        <div>
            <div className="draw-area" id="draw-area">
                <canvas id="canvas"></canvas>
            </div>
            <ul className="controls" id="controls">
                <li className="if-setup">
                    <button type="button" id="serialize">
                        export to clipboard
                    </button>
                </li>
                <li className="if-setup">
                    <button type="button" id="toggle-grid">
                        grid
                    </button>
                </li>
                <li className="if-create">
                    <button type="button" id="download">
                        download
                    </button>
                </li>
            </ul>
        </div>
    );
}