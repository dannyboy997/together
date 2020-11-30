import React, { Component } from 'react';
import { v4 } from 'uuid';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.roomId = this.props.roomId;
        this.name = this.props.name;
    }

    isPainting = false;
    // Different stroke styles to be used for user and guest
    userStrokeStyle = '#EE92C2';
    guestStrokeStyle = '#F0C987';
    line = [];
    // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
    userId = v4();
    prevPos = { offsetX: 0, offsetY: 0 };
    name;
    lastRefresh;

    onMouseDown({ nativeEvent }) {
        const { offsetX, offsetY } = nativeEvent;
        this.isPainting = true;
        this.prevPos = { offsetX, offsetY };
    }

    onMouseMove({ nativeEvent }) {
        if (this.isPainting) {
            const { offsetX, offsetY } = nativeEvent;
            const offSetData = { offsetX, offsetY };
            // Set the start and stop position of the paint event.
            const positionData = {
                start: { ...this.prevPos },
                stop: { ...offSetData },
            };
            // Add the position to the line array
            this.line = this.line.concat(positionData);
            this.paint(this.prevPos, offSetData, this.userStrokeStyle);
        }

        this.refreshData();
    }

    endPaintEvent() {
        if (this.isPainting) {
            this.isPainting = false;
            this.sendPaintData();
        }
    }

    paint(prevPos, currPos, strokeStyle) {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;
        // Move the the prevPosition of the mouse
        this.ctx.moveTo(x, y);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        this.prevPos = { offsetX, offsetY };
    }

    async sendPaintData() {
        const body = {
            line: this.line,
            userId: this.userId,
        };

        await fetch(`https://togetherservice.azurewebsites.net/paint?roomId=${this.props.roomId ?? 'Live'}&userId=${this.userId}`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
            },
        });
    }

    async refreshData() {
        if (this.lastRefresh === undefined || this.lastRefresh + 1000 < Date.now()) {
            this.lastRefresh = Date.now();

            const response = await fetch(`https://togetherservice.azurewebsites.net/paint?roomId=${this.props.roomId ?? 'Live'}&userId=${this.userId}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (response.text === null || response.text === undefined || response.status !== 200) {
                return;
            }

            const data = await response.json();

            if (data == null) {
                return;
            }

            data.forEach((lineData) => {
                if (lineData.userId !== this.userId) {
                    lineData.line.forEach((position) => {
                        this.paint(position.start, position.stop, this.guestStrokeStyle);
                    });
                }
            });
        }
    }

    componentDidMount() {
        // Here we set up the properties of the canvas element. 
        this.canvas.width = 1000;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
    }

    render() {
        return (
            <canvas
                // We use the ref attribute to get direct access to the canvas element. 
                ref={(ref) => (this.canvas = ref)}
                style={{ background: 'black' }}
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.endPaintEvent}
                onMouseUp={this.endPaintEvent}
                onMouseMove={this.onMouseMove}
            />
        );
    }
}
export default Canvas;