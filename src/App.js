import React, { Component } from "react";
import Sketch from "react-p5";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import "./reset.css";
import "./App.css";

export default class App extends Component {
  x = window.innerWidth / 2;
  y = window.innerHeight;
  r = 0;
  scale = "up";
  start = { x: 0, y: 0 };

  constructor() {
    super();
    this.state = {
      scrollBadgeVisible: true,
      sunriseTime: "",
      timeNow: "",
      diff: ""
    };
    this.onWheel = this.onWheel.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
  }

  componentDidMount() {
    let sunriseTime = "";
    navigator.geolocation.getCurrentPosition(function(position) {
      sunriseTime = getSunrise(
        position.coords.latitude,
        position.coords.longitude
      );
    });

    let that = this;
    setTimeout(function() {
      that.setState({
        sunriseTime: sunriseTime
      });
    }, 1000);

    setInterval(function() {
      let timeNow = new Date();
      let diff = sunriseTime - timeNow;
      let msec = diff;
      let hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      let ss = Math.floor(msec / 1000);
      msec -= ss * 1000;
      if (hh < 0) {
        hh = hh + 24;
      }
      if (mm < 0) {
        mm = mm + 60;
      }
      if (ss < 0) {
        ss = ss + 60;
      }
      if (hh < 10) {
        hh = `0${hh}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      if (ss < 10) {
        ss = `0${ss}`;
      }
      let textDiff = `${hh} ЧАСА ${mm} МИНУТ ${ss} СЕКУНД`;
      that.setState({
        timeNow: timeNow,
        diff: textDiff
      });
    }, 1000);
  }

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
  };

  draw = p5 => {
    p5.background(0, 5, 35);
    p5.circle(this.x, this.y, this.r);
    p5.fill(255, 0, 0);

    if (window.addEventListener) {
      if ("onwheel" in document) {
        // IE9+, FF17+, Ch31+
        window.addEventListener("wheel", this.onWheel);
        window.addEventListener("touchstart", this.touchStart, false);
        window.addEventListener("touchmove", this.touchMove, false);
      } else if ("onmousewheel" in document) {
        // устаревший вариант события
        window.addEventListener("mousewheel", this.onWheel);
      } else {
        // Firefox < 17
        window.addEventListener("MozMousePixelScroll", this.onWheel);
      }
    } else {
      // IE8-
      window.attachEvent("onmousewheel", this.onWheel);
    }

    // window.onwheel = this.onWheel;

    // if (window.addEventListener) {
    //   window.addEventListener("touchmove", function() {
    //     window.scroll;
    //   });
    // }
  };

  onWheel(e) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let biggestSide = "";
    if (width > height) {
      biggestSide = width;
    } else {
      biggestSide = height;
    }
    this.setState({
      scrollBadgeVisible: false
    });
    e = e || window.event;
    var delta = e.wheelDelta;

    if (this.r <= biggestSide * 2.2 && this.scale == "up") {
      this.r += delta / 5;
      // this.y -= delta / 9;
    } else if (this.r >= biggestSide * 2.2 && this.scale == "up") {
      this.scale = "down";
    } else if (this.r >= 0 && this.y <= height * 2.3 && this.scale == "down") {
      this.r -= delta / 5;
      this.y += delta / 5;
    } else if (this.y >= height * 2.3 && this.scale == "down") {
      this.r = 0;
      this.y = window.innerHeight;
      this.scale = "up";
    }
  }

  touchStart(e) {
    this.start.x = e.touches[0].pageX;
    this.start.y = e.touches[0].pageY;
  }

  touchMove(e) {
    let offset = {};

    offset.x = this.start.x - e.touches[0].pageX;
    offset.y = this.start.y - e.touches[0].pageY;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let biggestSide = "";
    if (width > height) {
      biggestSide = width;
    } else {
      biggestSide = height;
    }
    this.setState({
      scrollBadgeVisible: false
    });

    if (this.r <= biggestSide * 2.2 && this.scale == "up") {
      this.r += offset.y / 5;
      // this.y -= offset.y / 9;
    } else if (this.r >= biggestSide * 2.2 && this.scale == "up") {
      this.scale = "down";
    } else if (this.r >= 0 && this.y <= height * 2.3 && this.scale == "down") {
      this.r -= offset.y / 5;
      this.y += offset.y / 5;
    } else if (this.y >= height * 2.3 && this.scale == "down") {
      this.r = 0;
      this.y = window.innerHeight;
      this.scale = "up";
    }
  }

  render() {
    return (
      <div>
        <Sketch setup={this.setup} draw={this.draw} />
        <h1 className="time">
          ДО РАССВЕТА ОСТАЛОСЬ: <br />
          {this.state.diff}
        </h1>
        <h1 className="moto">РАССВЕТ НЕ ЗА ГОРАМИ</h1>
        {this.state.scrollBadgeVisible ? (
          <h1 className="scrollBadge">SCROLL</h1>
        ) : (
          ""
        )}
      </div>
    );
  }
}
