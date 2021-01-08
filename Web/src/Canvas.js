import React, { Component } from 'react';
import { v4 } from 'uuid';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.onResize = this.onResize.bind(this);
        this.roomId = this.props.roomId;
        this.name = this.props.name;

        this.state = {
            color: this.props.color,
            pollingCount: 0,
            delay: 3000
        };
    }

    //serviceUrl = 'https://localhost:44386';
    serviceUrl = 'https://togetherservice.azurewebsites.net';

    width = 1000;
    height = 800;

    scale = 1;

    isPainting = false;
    // Different stroke styles to be used for user and guest
    line = [];
    // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
    userId = v4();
    prevPos = { offsetX: 0, offsetY: 0 };
    name;
    lastRefresh;


    changeFormat(format) {
        this.setState({
            color: format
        });
    }

    onMouseDown({ nativeEvent }) {
        console.log('onMouseDown');
        const { offsetX, offsetY } = nativeEvent;
        this.isPainting = true;
        this.prevPos = { offsetX, offsetY };
    }

    onMouseMove({ nativeEvent }) {
        console.log('onMouseMove');
        if (this.isPainting) {
            const { offsetX, offsetY } = nativeEvent;
            const offSetData = { offsetX, offsetY };
            // Set the start and stop position of the paint event.
            const positionData = {
                start: { offsetX: this.prevPos.offsetX  / this.scale, offsetY: this.prevPos.offsetY  / this.scale },
                stop: { offsetX: offSetData.offsetX  / this.scale, offsetY: offSetData.offsetY  / this.scale }
            };
            // Add the position to the line array
            this.line = this.line.concat(positionData);
            this.paint(this.prevPos, offSetData, this.state.color, 1);

            this.prevPos = offSetData;
        }
    }

    endPaintEvent() {
        console.log('endPaintEvent');
        if (this.isPainting) {
            this.isPainting = false;
            this.sendPaintData();

            this.line = [];
        }
    }

    // Prevent scrolling when touching the canvas
    onTouchStart(nativeEvent) {
        console.log('onTouchStart');
        if (nativeEvent === undefined) {
            return;
        }

        if (nativeEvent.target === this.canvas) {
            nativeEvent.preventDefault();
        }

        this.isPainting = true;

        const { offsetX, offsetY } = this.getTouchPos(this.canvas, nativeEvent);
        this.isPainting = true;
        this.prevPos = { offsetX, offsetY };
    }

    onTouchMove(nativeEvent) {
        console.log('onTouchMove');

        if (nativeEvent === undefined) {
            return;
        }

        if (nativeEvent.target === this.canvas) {
            nativeEvent.preventDefault();
        }

        const { offsetX, offsetY } = this.getTouchPos(this.canvas, nativeEvent);
        const offSetData = { offsetX, offsetY };

        const positionData = {
            start: { offsetX: this.prevPos.offsetX  / this.scale, offsetY: this.prevPos.offsetY  / this.scale },
            stop: { offsetX: offSetData.offsetX  / this.scale, offsetY: offSetData.offsetY  / this.scale }
        };
        // Add the position to the line array
        this.line = this.line.concat(positionData);
        this.paint(this.prevPos, offSetData, this.state.color, 1);

        this.prevPos = offSetData;
    }

    getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            offsetX: touchEvent.touches[0].clientX - rect.left,
            offsetY: touchEvent.touches[0].clientY - rect.top
        };
    }

    paint(prevPos, currPos, strokeStyle, scale) {
        const { offsetX: x, offsetY: y } = prevPos;
        const { offsetX, offsetY } = currPos;

        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;
        // Move the the prevPosition of the mouse
        this.ctx.moveTo(x * scale, y * scale);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX * scale, offsetY * scale);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        //this.prevPos = { offsetX, offsetY };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async sendPaintData() {
        const body = [{
            line: this.line,
            userId: this.userId,
            color: this.state.color,
        }];

        await fetch(`${this.serviceUrl}/paintdata/${this.props.roomId ?? 'home'}?userId=${this.userId}`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
            },
        });
    }
    
    onResize(nativeEvent){
        console.log("resize");
        this.refreshData();
    }

    async refreshData() {
        if (this.lastRefresh === undefined || this.lastRefresh + 1000 < Date.now()) {
            this.lastRefresh = Date.now();

            const response = await fetch(`${this.serviceUrl}/paintdata/${this.props.roomId ?? 'home'}?userId=${this.userId}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (response.text === null || response.text === undefined || response.status !== 200) {
                return;
            }

            const paintData = await response.json();

            if (paintData == null) {
                return;
            }

            this.scale = this.canvesParent.clientWidth / this.width;

            this.canvas.width = this.canvesParent.clientWidth;
            this.canvas.height = this.height * this.scale;

            //this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

            paintData.forEach((lineData) => {
                //if (lineData.userId !== this.userId) {
                    lineData.line.forEach((line) => {
                        this.paint(line.start, line.stop, lineData.color, this.scale);
                    });
                //}
            });
        }
    }

    componentDidMount() {
        // Here we set up the properties of the canvas element. 
        console.log("mount");

        this.canvas.width = this.canvesParent.offsetWidth;
        this.canvas.height = this.canvesParent.offsetHeight;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 2;

        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.endPaintEvent, { passive: false });
        window.addEventListener('resize', this.onResize, { passive: false });
        this.clear();
        this.refreshData();

        this.interval = setInterval(this.tick, this.state.delay);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.delay !== this.state.delay){
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, this.state.delay);
        }

    }

    tick = () =>{
        this.refreshData();
    }

    render() {
        return (
            <div ref={(ref) => (this.canvesParent = ref)} className='parent-canvas'>
                <canvas
                    // We use the ref attribute to get direct access to the canvas element. 
                    ref={(ref) => (this.canvas = ref)}
                    className='canvas'
                    onMouseDown={this.onMouseDown}
                    onMouseLeave={this.endPaintEvent}
                    onMouseUp={this.endPaintEvent}
                    onMouseMove={this.onMouseMove}
                />
            </div>
        );
    }
}
export default Canvas;