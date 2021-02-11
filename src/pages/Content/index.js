import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { printLine } from './modules/print';
// import { decodedTextSpanIntersectsWith } from 'typescript';
import styled from 'styled-components';

console.log('Thu Phi Extension Loaded!');

/**
 * ! Styled component
 */
const Input = styled.input`
  outline: 1px solid #ccc;
  color: #005ddd;
  width: 50px;
  margin: 4px;
  text-align: right;

  &:focus {
    outline: 1px solid #009ddd;
  }
`;

const Button = styled.button`
  background: #006a99;
  border: 1px solid #ccc;
  borderradius: 2px;
  color: white;
  padding: 4px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: white;
    background: red;
  }
`;

const StyledA = styled.a`
  background: #fe5955;
  border: 1px solid #ccc;
  borderradius: 2px;
  color: white;
  padding: 4px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: white;
    background: red;
  }
`;

/**
 * ! Change page' style
 */
var style = document.createElement('style');
style.innerHTML = `
select[name="MA_LOAI_THANH_TOAN"] {
font-weight: bold !important;
color: red !important;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    flex-direction: row;
}

.grid::after {
  content:"";
  flex:auto;
}

.item {
  font-weight: normal;
  text-align: left;
  color: #0a043c;
  flex-basis: 20%;
}
 
input[name="SO_TK_HQ"] {
font-weight: bold !important;
color: red !important;
}
 
.SHOW_TIEN_TEXT {
font-weight: bold !important;
color: red !important;
border: 1px solid #eee;
border-radius: 5px;
padding: 5px;
background: #dedede
}
 
[class^="TR_"] :nth-child(5) {
font-weight: bold;
color: red;
text-align: center;
}
 
[class^="TR_"] {
font-weight: normal;
}
 
#TBLDANHSACH .bold :nth-child(3) {
font-weight: bold;
color: red;
text-align: center;
}
 
#TBLDANHSACH .bold :nth-child(1) {
font-weight: bold;
color: blue;
text-align: center;
}

// Tab style
/* Style the tab */
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  // float: left;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom:none;
  outline: none;
  cursor: pointer;
  padding: 8px 25px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  // display: none;
  padding: 2px 4px;
  // border: 1px solid #ccc;
  // border-top: none;
}


.batman {
  scale: 0.25;
  -webkit-animation-duration: 2s;
  -moz-animation-duration: 2s;
  -ms-animation-duration: 2s;
  -o-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-name: tremble;
  -moz-animation-name: tremble;
  -ms-animation-name: tremble;
  -o-animation-name: tremble;
  animation-name: tremble;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
  -moz-animation-direction: alternate;
  -ms-animation-direction: alternate;
  -o-animation-direction: alternate;
  animation-direction: alternate;
  margin: 0 auto;
  margin-top: 30px;
  width: 960px;
  position: static;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.5;
}

@keyframes tremble {
  from {
    margin-top: 30px;
    transform: rotate(-3deg);
    -webkit-transform: rotate(-3deg);
  }

  to {
    transform: rotate(3deg);
    -webkit-transform: rotate(3deg);
    margin-top: 40px;
  }
}

@-webkit-keyframes tremble {
  from {
    margin-top: 30px;
    transform: rotate(-3deg);
    -webkit-transform: rotate(-3deg);
  }

  to {
    transform: rotate(3deg);
    -webkit-transform: rotate(3deg);
    margin-top: 40px;
  }
}

.head {
  margin: 0 auto;
  width: 125px;
}

.left-ear {
  border-bottom: 70px solid #000;
  border-left: 5px solid transparent;
  border-right: 30px solid transparent;
  display: inline;
  float: left;
  height: 0;
  width: 0;
}

.right-ear {
  border-bottom: 70px solid #000;
  border-left: 30px solid transparent;
  border-right: 5px solid transparent;
  float: right;
  height: 0;
  width: 0;
}

.mask {
  background: #000;
  -webkit-border-radius: 0 0 10px 10px;
  -moz-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
  clear: both;
  height: 130px;
  width: 125px;
}

.neck {
  background: #000;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  height: 8px;
  margin: 0 auto;
  width: 80px;
}

.mouth {
  position: relative;
  height: auto;
  border-top: 35px solid #2B2B2B;
  border-left: 5px solid transparent;
  -webkit-border-radius: 3px 3px;
  -moz-border-radius: 3px 3px;
  border-radius: 3px 3px;
  border-right: 5px solid transparent;
  margin: 0 auto;
  top: 80px;
  width: 70px;
}

.nose {
  border-left: 15px solid transparent;
  border-top: 12px solid #000;
  border-right: 15px solid transparent;
  height: 0;
  margin-left: 30%;
  margin-top: -40px;
  position: absolute;
  width: 0;
}

.left-eye {
  border-left: 22px solid transparent;
  border-right: 22px solid transparent;
  border-top: 15px solid #fefefe;
  height: 0;
  margin-top: 45px;
  margin-left: 12px;
  position: absolute;
  width: 0;
}

.right-eye {
  border-left: 22px solid transparent;
  border-right: 22px solid transparent;
  border-top: 15px solid #fefefe;
  width: 0;
  height: 0;
  margin-left: 70px;
  margin-top: 45px;
  position: absolute;
}

.upper-lip {
  -webkit-box-shadow: 0px 2px 0px #000;
  -moz-box-shadow: 0px 2px 0px #000;
  box-shadow: 0px 2px 0px #000;
  height: 5px;
  margin-top: -25px;
  margin-left: 15px;
  width: 40px;
}

.lower-lip {
  -webkit-box-shadow: 0px 2px 0px #000;
  -moz-box-shadow: 0px 2px 0px #000;
  box-shadow: 0px 2px 0px #000;
  height: 5px;
  margin-top: 0px;
  margin-left: 25px;
  width: 20px;
}

.torso {
  border-bottom: 125px solid #000;
  border-left: 12px solid transparent;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  border-right: 12px solid transparent;
  height: 0;
  width: 130px;
  margin: 0 auto;
}

.chin {
  background: #000;
  height: 7px;
  margin-left: 20px;
  margin-top: 12px;
  width: 30px;
}

.waist {
  background: #0F0F0F;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  height: 27px;
  margin: 0 auto;
  position: relative;
  width: 150px;
}

.legs {
  margin: 0 auto;
  width: 155px;
}

.left-leg {
  background: #000;
  height: 80px;
  float: left;
  margin-left: 2px;
  width: 68px;
}

.croch {
  background: #000;
  float: left;
  height: 30px;
  width: 15px;
}

.right-leg {
  background: #000;
  float: right;
  height: 80px;
  margin-right: 2px;
  width: 68px;
}

.feet {
  margin: 0 auto;
  width: 160px;
}

.left-foot {
  background: #000;
  float: left;
  height: 37px;
  width: 73px;
}

.right-foot {
  background: #000;
  float: right;
  height: 37px;
  width: 72px;
}

.left-arm {
  background: #000;
  height: 45px;
  margin-left: 320px;
  margin-top: -150px;
  position: absolute;
  width: 105px;
  z-index: -2;
}

.right-arm {
  background: #000;
  height: 45px;
  margin-left: 540px;
  margin-top: -150px;
  position: absolute;
  width: 105px;
  z-index: -2;
}

/* batman wings - making them flap when flyind due to air resistance */  
.wings {
  -webkit-animation-direction: alternate;
  -moz-animation-direction: alternate;
  -ms-animation-direction: alternate;
  -o-animation-direction: alternate;
  animation-direction: alternate;
  -webkit-animation-duration: .4s;
  -moz-animation-duration: .4s;
  -ms-animation-duration: .4s;
  -o-animation-duration: .4s;
  animation-duration: .4s;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-name: flapping;
  -moz-animation-name: flapping;
  -ms-animation-name: flapping;
  -o-animation-name: flapping;
  animation-name: flapping;
  border-top: 140px solid #EB1E1E;
  border-left: 225px solid transparent;
  border-right: 225px solid transparent;
  margin-left: 260px;
  margin-top: -115px;
  width: 0;
  height: 0;
  position: absolute;
  z-index: -3;
}

@keyframes flapping {
  from {
    border-top: 140px solid #EB1E1E;
  }

  to {
    border-top: 130px solid #EB1E1E;
  }
}

@-webkit-keyframes flapping {
  from {
    border-top: 140px solid #EB1E1E;
  }

  to {
    border-top: 130px solid #EB1E1E;
  }
}

.left-hand {
  background: #000;
  -webkit-border-radius: 70px;
  -moz-border-radius: 70px;
  border-radius: 70px;
  margin-top: -152px;
  margin-left: 280px;
  height: 50px;
  position: absolute;
  width: 50px;
}

.right-hand {
  background: #000;
  -webkit-border-radius: 70px;
  -moz-border-radius: 70px;
  border-radius: 70px;
  margin-top: -152px;
  margin-left: 635px;
  height: 50px;
  position: absolute;
  width: 50px;
}

/* batman chest logo */
.bat-body {
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 30px solid #EB1E1E;
  height: 0;
  position: absolute;
  width: 0;
}

.left-bat-ear {
  border-bottom: 15px solid #EB1E1E;
  border-right: 15px solid transparent;
  height: 0;
  margin-left: 22px;
  margin-top: -10px;
  position: absolute;
  width: 0;
}

.left-bat-wing-1 {
  border-bottom: 15px solid #EB1E1E;
  border-right: 15px solid transparent;
  height: 0;
  margin-left: 0px;
  margin-top: -15px;
  position: absolute;
  width: 0;
}

.right-bat-ear {
  border-bottom: 15px solid #EB1E1E;
  border-left: 15px solid transparent;
  height: 0;
  margin-left: 22px;
  margin-top: -10px;
  position: absolute;
  width: 0;
}

.right-bat-wing-1 {
  border-bottom: 15px solid #EB1E1E;
  border-left: 15px solid transparent;
  height: 0;
  margin-left: 45px;
  margin-top: -15px;
  position: absolute;
  width: 0;
}

.left-bat-wing-2 {
  border-top: 6px solid #EB1E1E;
  border-left: 6px solid transparent;
  height: 0;
  margin-left: -6px;
  margin-top: -15px;
  position: absolute;
  width: 0;
}

.right-bat-wing-2 {
  border-top: 6px solid #EB1E1E;
  border-right: 6px solid transparent;
  height: 0;
  margin-left: 60px;
  margin-top: -15px;
  position: absolute;
  width: 0;
}

/* batman belt */  
.emblem {
  position: absolute;
  margin-top: -100px;
  margin-left: 450px;
}

.belt {
  margin: 0 auto;
  position: absolute;
}

.buckle {
  background: #404040;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 32px;
  margin-top: -30px;
  margin-left: 465px;
  width: 32px;
}

.orb {
  background: #EB1E1E;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 23px;
  margin-top: -27px;
  margin-left: 470px;
  width: 23px;
}

.cartridge-1 {
  background: #404040;
  height: 27px;
  margin-top: -25px;
  margin-left: 420px;
  position: absolute;
  width: 10px;
}

.cartridge-2 {
  background: #404040;
  height: 27px;
  margin-top: -25px;
  margin-left: 440px;
  position: absolute;
  width: 10px;
}

.cartridge-3 {
  background: #404040;
  height: 27px;
  margin-top: -25px;
  margin-left: 510px;
  position: absolute;
  width: 10px;
}

.cartridge-4 {
  background: #404040;
  margin-top: -25px;
  margin-left: 530px;
  position: absolute;
  height: 27px;
  width: 10px;
}

/* batman arm spikes */
.left-spike-1 {
  border-top: 15px solid #000;
  border-left: 15px solid transparent;
  height: 0;
  margin-left: 325px;
  margin-top: -105px;
  position: absolute;
  width: 0;
}

.left-spike-2 {
  border-top: 15px solid #000;
  border-left: 15px solid transparent;
  height: 0;
  margin-left: 340px;
  margin-top: -105px;
  position: absolute;
  width: 0;
}

.left-spike-3 {
  border-top: 15px solid #000;
  border-left: 15px solid transparent;
  height: 0;
  margin-left: 355px;
  margin-top: -105px;
  position: absolute;
  width: 0;
}

.right-spike-1 {
  border-top: 15px solid #000;
  border-right: 15px solid transparent;
  height: 0;
  margin-left: 625px;
  margin-top: -105px;
  width: 0;
  position: absolute;
}

.right-spike-2 {
  border-top: 15px solid #000;
  border-right: 15px solid transparent;
  height: 0;
  margin-left: 610px;
  margin-top: -105px;
  position: absolute;
  width: 0;
}

.right-spike-3 {
  border-top: 15px solid #000;
  border-right: 15px solid transparent;
  height: 0;
  margin-left: 595px;
  margin-top: -105px;
  position: absolute;
  width: 0;
}

/* batman propulsion smoke */
.propulsion {
  margin: 0 auto;
}

.left-jet {
  -webkit-animation-duration: .8s;
  -moz-animation-duration: .8s;
  -ms-animation-duration: .8s;
  -o-animation-duration: .8s;
  animation-duration: .8s;
  -webkit-animation-name: flight;
  -moz-animation-name: flight;
  -ms-animation-name: flight;
  -o-animation-name: flight;
  animation-name: flight;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
  -moz-animation-direction: alternate;
  -ms-animation-direction: alternate;
  -o-animation-direction: alternate;
  animation-direction: alternate;
  background-color: #fff;
  background: -webkit-gradient(linear,0 50%,100% 50%,from(rgba(255,255,255,0)),to(rgba(255,255,255,1)));
  background: -webkit-linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  background: -moz-linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  background: -o-linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  background: linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  -webkit-border-radius: 75% 75% 100% 100% / 30% 30% 150% 150%;
  -moz-border-radius: 75% 75% 100% 100% / 30% 30% 150% 150%;
  border-radius: 75% 75% 100% 100% / 30% 30% 150% 150%;
  display: block;
  float: left;
  height: 200px;
  margin-left: 410px;
  margin-top: -15px;
  opacity: .1;
  position: relative;
  width: 55px;
  z-index: -10;
}

.right-jet {
  -webkit-animation-duration: .9s;
  -moz-animation-duration: .9s;
  -ms-animation-duration: .9s;
  -o-animation-duration: .9s;
  animation-duration: .9s;
  -webkit-animation-name: flight;
  -moz-animation-name: flight;
  -ms-animation-name: flight;
  -o-animation-name: flight;
  animation-name: flight;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
  -moz-animation-direction: alternate;
  -ms-animation-direction: alternate;
  -o-animation-direction: alternate;
  animation-direction: alternate;
  background-color: #fff;
  background: -webkit-gradient(linear,0 50%,100% 50%,from(rgba(255,255,255,0)),to(rgba(255,255,255,1)));
  background: -webkit-linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  background: -moz-linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  background: -o-linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  background: linear-gradient(0deg, rgba(255,255,255,0), rgba(255,255,255,1));
  -webkit-border-radius: 75% 75% 100% 100% / 30% 30% 150% 150%;
  -moz-border-radius: 75% 75% 100% 100% / 30% 30% 150% 150%;
  border-radius: 75% 75% 100% 100% / 30% 30% 150% 150%;
  display: block;
  float: right;
  height: 200px;
  margin-right: 410px;
  margin-top: -15px;
  opacity: .1;
  position: relative;
  width: 55px;
  z-index: -40;
}

/* animating the smoke opacity */
@keyframes flight {
  from {
    opacity: .1;
  }

  to {
    opacity: .3;
  }
}

@-webkit-keyframes flight {
  from {
    opacity: .1;
  }

  to {
    opacity: .3;
  }
}

/* the clouds */
.cloud-1 {
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -ms-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
  -webkit-animation-duration: 3s;
  -moz-animation-duration: 3s;
  -ms-animation-duration: 3s;
  -o-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-name: cloud-1;
  -moz-animation-name: cloud-1;
  -ms-animation-name: cloud-1;
  -o-animation-name: cloud-1;
  animation-name: cloud-1;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -moz-animation-timing-function: ease-in-out;
  -ms-animation-timing-function: ease-in-out;
  -o-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  margin: 0 auto;
  margin-left: 25%;
  margin-top: -600px;
  opacity: 0;
  position: absolute;
  z-index: -11;
}

.cloud-2 {
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -ms-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
  -webkit-animation-duration: 3s;
  -moz-animation-duration: 3s;
  -ms-animation-duration: 3s;
  -o-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-name: cloud-2;
  -moz-animation-name: cloud-2;
  -ms-animation-name: cloud-2;
  -o-animation-name: cloud-2;
  animation-name: cloud-2;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -moz-animation-timing-function: ease-in-out;
  -ms-animation-timing-function: ease-in-out;
  -o-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  margin: 0 auto;
  margin-left: 50%;
  margin-top: -500px;
  opacity: .5;
}

.cloud-3 {
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -ms-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
  -webkit-animation-duration: 3s;
  -moz-animation-duration: 3s;
  -ms-animation-duration: 3s;
  -o-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-name: cloud-3;
  -moz-animation-name: cloud-3;
  -ms-animation-name: cloud-3;
  -o-animation-name: cloud-3;
  animation-name: cloud-3;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -moz-animation-timing-function: ease-in-out;
  -ms-animation-timing-function: ease-in-out;
  -o-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  margin: 0 auto;
  margin-left: 70%;
  margin-top: -300px;
  opacity: .5;
}

/* animating the clouds */
@keyframes cloud-1 {
  from {
    margin-top: -600px;
    margin-left: 20%;
    opacity: 0;
  }

  45% {
    opacity: .1;
  }
  
  70% {
    opacity: 0;
  }
  
  to {
    margin-top: 30%;
    margin-left: 10%;
    opacity: 0;
  }
}

@keyframes cloud-2 {
  from {
    margin-top: -800px;
    opacity: 0; 
  }

  45% {
    opacity: .1;
  }

  to {
    margin-top: 30%;
    margin-left: 50%;
    opacity: 0;
  }
}

@keyframes cloud-3 {
  from {
    margin-top: -1100px;
    opacity: 0;
  }

  35% {
    opacity: .1;
  }

  80% {
    opacity: 0;
  }
  
  to {
    margin-top: 30%;
    margin-left: 75%;
    opacity: 0;
  }
}

@-webkit-keyframes cloud-1 {
  from {
    margin-top: -600px;
    margin-left: 20%;
    opacity: 0;
  }

  45% {
    opacity: .1;
  }
  
  70% {
    opacity: 0;
  }
  
  to {
    margin-top: 30%;
    margin-left: 10%;
    opacity: 0;
  }
}

@-webkit-keyframes cloud-2 {
  from {
    margin-top: -800px;
    opacity: 0; 
  }

  45% {
    opacity: .1;
  }

  to {
    margin-top: 30%;
    margin-left: 50%;
    opacity: 0;
  }
}

@-webkit-keyframes cloud-3 {
  from {
    margin-top: -1100px;
    opacity: 0;
  }

  35% {
    opacity: .1;
  }

  80% {
    opacity: 0;
  }
  
  to {
    margin-top: 30%;
    margin-left: 75%;
    opacity: 0;
  }
}

.puff-1 {
  background: #fff;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 100px;
  position: absolute;
  width: 100px;
}

.puff-2 {
  background: #fff;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 100px;
  margin-left: 75px;
  position: absolute;
  width: 100px;
}

.puff-3 {
  background: #fff;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 100px;
  margin-left: -25px;
  margin-top: 30px;
  position: absolute;
  width: 100px;
}

.puff-4 {
  background: #fff;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 100px;
  margin-left: 50px;
  margin-top: 30px;
  position: absolute;
  width: 100px;
}

.puff-5 {
  background: #fff;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  height: 100px;
  margin-left: 125px;
  margin-top: 30px;
  position: absolute;
  width: 100px;
}


`;
document.head.appendChild(style);

/**
 * ! Create shorcut keys
 */
const shorcutKeys = (e) => {
  //Check if shorcut is pressed
  try {
    if ((e.ctrlKey && e.keyCode == 219) || e.keyCode == 219) {
      //Click the element Ctrl + [
      console.log('Tạo biên lai clicked');
      document.getElementsByClassName('btn btn-primary btn-primary')[2].click();
    }

    //Button ]
    if ((e.ctrlKey && e.keyCode == 221) || e.keyCode == 221) {
      if (
        document.getElementsByClassName('form-control input-sm')[13].value ==
        'CK'
      ) {
        alert(`Hình thức thanh toán là Chuyển khoản a a a á!`);
      }
      console.log('Lưu lại clicked');
      document
        .getElementsByClassName('btn btn-primary mr10px btn-padding')[0]
        .click();
    }

    //Button /
    if (e.keyCode == 191) {
      document.getElementById('deleteButton').click();
      document.getElementsByName('SO_TK')[0].focus();
      console.log('Delete everthing');
    }

    //Ctrl + \
    if ((e.ctrlKey && e.keyCode == 220) || e.keyCode == 220) {
      console.log('Phát hành clicked');
      document
        .getElementsByClassName(
          'btn btn-success mr10px btn-padding btn-issued-invoice pull-left'
        )[0]
        .click();
    }

    // Button =
    if (e.keyCode == 187) {
      console.log('One-click clicked');
      document.getElementById('one-click').click();
    }

    //' Button
    if (e.keyCode == 222) {
      const currentURL = window.location.href;
      if (currentURL.includes('10.10.10.20')) {
        window.location.href =
          'http://10.10.10.20:8221/tim-kiem-to-khai-nop-phi';
      } else {
        window.location.href =
          'http://thuphi.haiphong.gov.vn:8221/tim-kiem-to-khai-nop-phi';
      }
    }
  } catch (error) {
    console.log('Có lỗi xảy ra: ' + error.message);
  }
};

// register the handler
document.addEventListener('keyup', shorcutKeys, false);

/**
 * ! Get extension ID
 */
const extensionID = chrome.runtime.id;

// printLine("Using the 'printLine' function from the Print Module");

/*
! Gett domain from URL for sending request to
*/
//URL for sending request
const apiURL = window.location.hostname;

//Correct URL for displaying the extension
const correctURL = document.URL.includes('tim-kiem-to-khai-nop-phi')
  ? 'block'
  : 'none';

const isURL = document.URL.includes('cap-nhat-thong-tin-bien-lai-dien-tu')
  ? 'block'
  : 'none';

/**
 * ! Disable some uncessary field
 */
// Ma DN
// try {
//   document.getElementsByName('MA_DN')[0].style.display = 'none';
//   document.getElementsByClassName(
//     'btn btn-success btnPhatHanhBienLaiTheoLo'
//   )[0].style.display = 'none';
// } catch {}

const cardBody = document.getElementsByClassName('card-body')[0];
const capnhatBody = document.getElementsByClassName(
  'card-footer text-right'
)[0];

// Main Extension Content
/**
 * ! For sending request with verification and cookies info
 */

axios.defaults.withCredentials = true;
const verificationToken = document.querySelector(
  '[name=__RequestVerificationToken]'
).value;

/**
 * ! The Components
 */
// Components
const ContentReact = () => {
  const [listTK, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBL, setBL] = useState('');

  /**
   * ! Load current List from Local Storage
   */
  useEffect(() => {
    // console.log('effect');
    setList(
      JSON.parse(window.localStorage.getItem('danh_sach')) !== null
        ? JSON.parse(window.localStorage.getItem('danh_sach'))
        : []
    );
    // console.log(listTK);
  }, []);

  //---Get bill number and add it to the array
  //Function to get info of a customs declaration number
  const getAndAdd = async (soToKhai) => {
    //Check if soToKhai is already added
    try {
      const addedList = listTK.map((element) => element.SO_TKHQ);
      // console.log(addedList);
      if (addedList.includes(soToKhai)) {
        alert('Tờ khai đã được thêm!');
        return;
      }
    } catch {}

    /**
     * ! Getting declaration info
     */
    //convert soToKhai to form-data for sending POST request
    const data = new FormData();
    data.append('SO_TK', soToKhai);
    try {
      setLoading(true);
      const response = await axios.post(
        'http://' + apiURL + ':8221/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/',
        data,
        {
          headers: {
            __RequestVerificationToken: verificationToken,
          },
          withCredentials: true,
        }
      );
      printLine(response);
      response.data.code !== 1
        ? alert('Có lỗi xảy ra trong quá trình lấy thông tin!')
        : setList(listTK.concat(response.data.DANHSACH));
      if (response !== undefined) setLoading(false);
    } catch (error) {
      alert(error.message);
      // window.location.reload();
    }
  };

  /**
   * ! Get info of a specific declaration number
   */
  const getInfo = async (numTK) => {
    const data = new FormData();
    data.append('SO_TK', numTK);
    try {
      const result = await axios.post(
        'http://' + apiURL + ':8221/DToKhaiNopPhi/GetThongBaoNP_TaoBienLai/',
        data,
        {
          headers: {
            __RequestVerificationToken: verificationToken,
          },
          withCredentials: true,
        }
      );
      return result.data;
    } catch (err) {
      return undefined;
    }
  };

  const addTK = (soToKhai) => {
    // console.log('So TK: ' + soToKhai);
    getAndAdd(soToKhai);
  };

  const removeTK = (khaiNumber) => {
    // console.log('Removing TK ' + khaiNumber);
    const index = getIndex(khaiNumber);
    // console.log(index);
    const newList = [...listTK];
    newList.splice(index, 1);
    window.localStorage.setItem('danh_sach', JSON.stringify(newList));
    setList(newList);
  };

  /**
   * ! Getting Index of declaration
   */
  const getIndex = (khaiNumber) => {
    return listTK.map((element) => element.SO_TK_NOP_PHI).indexOf(khaiNumber);
  };

  const Batman = () => {
    return (
      <div className="batman">
        {/* <!-- start of batman head --> */}
        <div className="head">
          <div className="left-ear"></div>
          <div className="right-ear"></div>
          <div className="mask">
            <div className="left-eye"></div>
            <div className="right-eye"></div>
            <div className="mouth">
              <div className="nose"></div>
              <div className="upper-lip"></div>
              <div className="lower-lip"></div>
              <div className="chin"></div>
            </div>
          </div>
          <div className="neck"></div>
        </div>
        {/* <!-- end of batman head --> */}

        {/* <!-- start of batman body --> */}
        <div className="full-body">
          <div className="torso"></div>
          <div className="waist"></div>
          <div className="left-hand"></div>
          <div className="left-arm"></div>
          <div className="right-arm"></div>
          <div className="right-hand"></div>
          {/* <!-- batman arm spikes --> */}
          <div className="spikes">
            <div className="left-spike-1"></div>
            <div className="left-spike-2"></div>
            <div className="left-spike-3"></div>
            <div className="right-spike-1"></div>
            <div className="right-spike-2"></div>
            <div className="right-spike-3"></div>
          </div>
          <div className="legs">
            <div className="left-leg"></div>
            <div className="croch"></div>
            <div className="right-leg"></div>
          </div>
          <div className="feet">
            <div className="left-foot"></div>
            <div className="right-foot"></div>
          </div>
          <div className="wings"></div>
          {/* <!-- the batman beyond logo (sort of) --> */}
          <div className="emblem">
            <div className="left-bat-ear"></div>
            <div className="right-bat-ear"></div>
            <div className="left-bat-wing-1"></div>
            <div className="right-bat-wing-1"></div>
            <div className="left-bat-wing-2"></div>
            <div className="right-bat-wing-2"></div>
            <div className="bat-body"></div>
          </div>
          {/* <!-- batman's belt buckle and cartridges--> */}
          <div className="belt">
            <div className="buckle"></div>
            <div className="orb"></div>
            <div className="cartridge-1"></div>
            <div className="cartridge-2"></div>
            <div className="cartridge-3"></div>
            <div className="cartridge-4"></div>
          </div>
          {/* <!-- propulsion smoke --> */}
          <div className="propulsion">
            <div className="left-jet"></div>
            <div className="right-jet"></div>
          </div>
        </div>
        {/* <!-- end of batman body --> */}

        {/* <!-- start of clouds --> */}
        <div className="cloud-1">
          {/* <!-- each cloud is made 5 circes (puffs) --> */}
          <div className="puff-1"></div>
          <div className="puff-2"></div>
          <div className="puff-3"></div>
          <div className="puff-4"></div>
          <div className="puff-5"></div>
        </div>
        <div className="cloud-2">
          <div className="puff-1"></div>
          <div className="puff-2"></div>
          <div className="puff-3"></div>
          <div className="puff-4"></div>
          <div className="puff-5"></div>
        </div>
        <div className="cloud-3">
          <div className="puff-1"></div>
          <div className="puff-2"></div>
          <div className="puff-3"></div>
          <div className="puff-4"></div>
          <div className="puff-5"></div>
        </div>
        {/* <!-- end of clouds --> */}
      </div>
    );
  };

  /**
   * ! Loading batman running
   */
  const BatmanRun = ({ loadingStatus }) => {
    return (
      <>
        <span style={{ display: 'inline-block' }}>
          &nbsp;&nbsp;
          <img
            src={
              'chrome-extension://' +
              extensionID +
              '/' +
              (Math.floor(Math.random() * 4) + 1 + '.gif')
            }
            height="64"
            style={{
              display: loadingStatus === true ? 'inline-block' : 'none',
            }}
          />
        </span>
      </>
    );
  };

  /**
   * ! Visual for AddToKhai
   */
  const AddToKhai = () => {
    return (
      <>
        <div>
          {/* <form onSubmit={addTK} style={{ display: 'inline-block' }}>
            <input
              onClick={() => setBill('')}
              onChange={numberChange}
              value={billNumber}
              autoFocus={true}
              maxLength="12"
              placeholder="Số tờ khai, thông báo nộp phí"
              className="item-search except form-control form-control-sm"
              style={{
                width: 270,
                display: 'inline-block',
                borderColor: '#54C6EB',
                background: 'white',
              }}
            />
            <span>&nbsp;&nbsp;</span>
            <button className="btn btn-primary btnSearch">
              <strong>+</strong> Thêm
            </button>
          </form> */}
          <span>
            <strong style={{ color: '#001234' }}>
              Danh sách Tờ khai Hải quan đã xuất Biên lai
            </strong>
            &nbsp;&nbsp;
            <Button
              id="deleteButton"
              onClick={() => {
                setList([]);
                window.localStorage.removeItem('danh_sach');
                document.getElementsByName('SO_TK')[0].focus();
              }}
            >
              <strong>⌦</strong> Xóa hết
            </Button>
          </span>
        </div>
      </>
    );
  };

  /**
   * ! Visual for each declaration number
   */
  const ListItem = ({ item }) => {
    // console.log('Item being displayed: ', item);
    //Case of type
    let type = '';
    switch (item.LOAI_TK_NP) {
      case '100':
        type = <span style={{ color: 'green' }}>Hàng container</span>;
        break;
      case '101':
        type = <span style={{ color: '#007A99' }}>Hàng lỏng, rời</span>;
        break;
      default:
        break;
    }

    //Case số biên lai
    let receiptNumber = (
      <a
        href="#"
        onClick={() =>
          window.open(
            'http://' +
              apiURL +
              ':8224/Viewer/HoaDonViewer.aspx?mhd=' +
              item.EINVOICE_LINK,
            'example',
            'width=1200,height=800'
          )
        }
        style={{ fontWeight: 'bold' }}
      >
        <span style={{ color: '#007A99' }}>{item.MA_TRAM_TP}</span>
        <span style={{ color: 'black' }}>&nbsp;-&nbsp;</span>
        <span style={{ color: '#FF6633' }}>
          {item.SO_BIEN_LAI.padStart(7, '0')}
        </span>
      </a>
    );

    //Row index
    const rowIndex = getIndex(item.SO_TK_NOP_PHI) + 1;

    return (
      <tr>
        <td className="text-center">
          <a
            href="#"
            onClick={() =>
              window.open(
                'http://' +
                  apiURL +
                  ':8221/cap-nhat-thong-tin-to-khai/' +
                  item.DTOKHAINPID,
                'example',
                'width=1200,height=800'
              )
            }
          >
            <em style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              Xem
            </em>
          </a>
        </td>
        {/* -----------------STT--------------------------- */}
        <td className="text-center">{rowIndex}</td>

        {/* -----------------SỐ TỜ KHAI NỘP PHÍ--------------------------- */}
        <td className="text-center">{item.SO_TK_NOP_PHI}</td>

        {/* ------------------LOẠI HÀNG-------------------------- */}
        <td className="text-center">{type}</td>

        {/* ------------------SỐ TỜ KHAI HẢI QUAN-------------------------- */}
        <td
          className="text-center"
          style={{ color: 'red', fontWeight: 'bold' }}
        >
          {item.SO_TKHQ}
        </td>

        {/* ----------------TÊN DOANH NGHIỆP---------------------------- */}
        <td
          className="text-left"
          style={{ fontWeight: 'normal', width: 'auto' }}
        >
          {item.MA_DV_KHAI_BAO + ' - ' + item.TEN_DN}
        </td>
        {/* ------------------NGÀY TỜ KHAI-------------------------- */}
        <td className="text-center">{item.NGAY_TK_HQ}</td>

        {/* -------------SỐ TIỀN------------------------------- */}
        <td
          className="text-right"
          style={{ color: '#012a4a', fontWeight: 'bold' }}
        >
          {item.TONG_TIEN.toLocaleString('vi')}
        </td>

        {/* -------------HÌNH THỨC THANH TOÁN------------------------------- */}
        <td
          className="text-center"
          style={{ color: '#B146C2', fontWeight: 'bold' }}
        >
          {item.MA_LOAI_THANH_TOAN}
        </td>

        {/* ------------------SỐ BIÊN LAI-------------------------- */}
        <td className="text-center">{receiptNumber}</td>

        {/* ------------------Checkbox-------------------------- */}
        {/* <td className="text-center">
          <input type="checkbox" onClick={() => getSelected()} />
        </td> */}
        {/* ------------------TIME-------------------------- */}
        <td className="text-center">{item.TIME}</td>

        {/* ----------------XÓA TỜ KHAI---------------------------- */}
        <td
          className="text-center"
          onClick={() => removeTK(item.SO_TK_NOP_PHI)}
        >
          <a href="#" style={{ color: 'red' }}>
            <em>Xóa</em>
          </a>
        </td>
      </tr>
    );
  };

  /**
   * ! Function to get selected row values
   */
  const getSelected = () => {
    const grid = document.getElementById('dsTable');
    const checkboxes = grid.getElementsByTagName('input');

    //Loop through checkboxes
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        const selectedRow = checkboxes[i].parentNode.parentNode;

        printLine(selectedRow.cells[7].innerHTML);
      }
    }
  };

  /**
   * ! Tính tiền thừa:
   */
  const MoneyChange = () => {
    /**
     * ! Money change
     */
    let totalAmount = 0;
    let change = 0;
    const [money, setMoney] = useState([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      1000,
      2000,
      5000,
      10000,
      20000,
      50000,
      100000,
      200000,
      500000,
    ]);

    for (let i = 0; i < 9; i++) {
      totalAmount = totalAmount + money[i] * money[i + 9];
    }

    const currentMoney =
      document.getElementById('total_debt') !== null
        ? parseInt(document.getElementById('total_debt').innerHTML) * 1000
        : 0;

    change = totalAmount - currentMoney;

    /**
     * ! Handle Change
     */
    const update = (index, new_value) => {
      const data = [...money];
      data[index] = new_value;
      return data;
    };

    const noteChange = (e) => {
      const id = e.target.id;
      const value = parseInt(e.target.value);

      switch (id) {
        case '1k':
          setMoney(update(0, value));
          break;
        case '2k':
          setMoney(update(1, value));
          break;
        case '5k':
          setMoney(update(2, value));
          break;
        case '10k':
          setMoney(update(3, value));
          break;
        case '20k':
          setMoney(update(4, value));
          break;
        case '50k':
          setMoney(update(5, value));
          break;
        case '100k':
          setMoney(update(6, value));
          break;
        case '200k':
          setMoney(update(7, value));
          break;
        case '500k':
          setMoney(update(8, value));
          break;
        default:
          break;
      }
    };

    const resetInput = (e) => {
      const id = e.target.id;
      switch (id) {
        case '1k':
          setMoney(update(0, ''));
          break;
        case '2k':
          setMoney(update(1, ''));
          break;
        case '5k':
          setMoney(update(2, ''));
          break;
        case '10k':
          setMoney(update(3, ''));
          break;
        case '20k':
          setMoney(update(4, ''));
          break;
        case '50k':
          setMoney(update(5, ''));
          break;
        case '100k':
          setMoney(update(6, ''));
          break;
        case '200k':
          setMoney(update(7, ''));
          break;
        case '500k':
          setMoney(update(8, ''));
          break;
        default:
      }
    };

    return (
      <>
        <td colSpan="6">
          <div className="grid">
            <span className="item">
              <Input onChange={(e) => noteChange(e)} id="1k" value={money[0]} />
              {' x 1.000đ'}
            </span>
            <span className="item">
              <Input onChange={(e) => noteChange(e)} id="2k" value={money[1]} />
              {' x 2.000đ'}
            </span>
            <span className="item">
              <Input onChange={(e) => noteChange(e)} id="5k" value={money[2]} />
              {' x 5.000đ'}
            </span>
            <span className="item">
              <Input
                onChange={(e) => noteChange(e)}
                id="10k"
                value={money[3]}
              />
              {' x 10.000đ'}
            </span>
            <span className="item">
              <Input
                onChange={(e) => noteChange(e)}
                id="20k"
                value={money[4]}
              />
              {' x 20.000đ'}
            </span>
            <span className="item">
              <Input
                onChange={(e) => noteChange(e)}
                id="50k"
                value={money[5]}
              />
              {' x 50.000đ'}
            </span>
            <span className="item">
              <Input
                onChange={(e) => noteChange(e)}
                id="100k"
                value={money[6]}
              />
              {' x 100.000đ'}
            </span>
            <span className="item">
              <Input
                onChange={(e) => noteChange(e)}
                id="200k"
                value={money[7]}
              />
              {' x 200.000đ'}
            </span>
            <span className="item">
              <Input
                onChange={(e) => noteChange(e)}
                id="500k"
                value={money[8]}
              />
              {' x 500.000đ'}
            </span>
          </div>
        </td>
        <td>
          <div style={{ fontWeight: 'bold' }}>Tổng:</div>
        </td>
        <td
          style={{
            color: '#006a99',
            borderBottom: '2px solid #ccc',
            textAlign: 'right',
            fontWeight: 'bold',
          }}
        >
          <div id="received">{totalAmount.toLocaleString('vi')}</div>
        </td>
        <td
          colSpan="4"
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <div>
            Trả lại:
            <span style={{ color: 'red' }}> {change.toLocaleString('vi')}</span>
          </div>
        </td>
      </>
    );
  };

  /**
   * ! The declaration List visual
   */
  const ListDisplay = () => {
    let sortedList = [...listTK];
    sortedList.sort(
      (a, b) => getIndex(b.SO_TK_NOP_PHI) - getIndex(a.SO_TK_NOP_PHI)
    );
    // console.log(listTK, sortedList);
    return (
      <>
        <div style={{ height: 'auto', overflow: 'scroll', zIndex: '2' }}>
          <table id="dsTable" className="width100">
            <thead>
              <tr>
                <th className="width50px text-center">#</th>
                <th className="width50px text-center">STT</th>
                <th className="text-center">TK Nộp Phí</th>
                <th className="text-center">Loại hàng</th>
                <th className="text-center">TK hải quan</th>
                <th className="text-center">Doanh nghiệp</th>
                <th className="text-center">Ngày TK</th>
                <th className="text-center">Số tiền</th>
                <th className="text-center">Hình thức TT</th>
                <th className="text-center width100px">Biên lai</th>
                {/* <th className="text-center width100px">
                  <input type="checkbox" />
                </th> */}
                <th className="text-center width100px">Added at</th>
                <th className="text-center">Operation</th>
              </tr>
            </thead>
            <tbody>
              {/* ------------- TỔNG TIỀN CỦA TOÀN BỘ TỜ KHAI ĐÃ THÊM */}
              <tr>
                <MoneyChange />
              </tr>
              <tr className="bold">
                <td className="text-center bold" colSpan="7">
                  Tổng tiền của{' '}
                  <span style={{ color: 'red' }}>{listTK.length}</span> bộ là:
                </td>
                <td
                  id="total_debt"
                  style={{
                    color: 'red',
                    borderBottom: '2px solid #ccc',
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  {listTK.length > 0
                    ? listTK
                        .map((element) => element.TONG_TIEN)
                        .reduce((sum, current) => sum + current)
                        .toLocaleString('vi')
                    : 0}
                </td>
                <td className="text-center" colSpan="4">
                  <img
                    src={
                      'chrome-extension://' +
                      extensionID +
                      '/' +
                      'icon-bat-34.png'
                    }
                  />
                </td>
              </tr>
              {/*-------------- DANH SÁCH TỜ KHAI ĐÃ THÊM------------ */}
              {sortedList.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
            </tbody>
          </table>
          {/* <Batman /> */}
        </div>
      </>
    );
  };

  /**
   * ! cap-nhat-thong-tin-bien-lai-dien-tu page
   */

  /**
   * ! Add issued BL to list
   */
  const addTK2 = () => {
    printLine('ADDTK2 CLICKED');
    // const info = {
    //   TIME: new Date().toLocaleTimeString(),
    //   DTOKHAINPID: document.getElementsByName('DTOKHAINPID')[0].value || '',
    //   SO_TK_NOP_PHI: document.getElementById('SO_TK_NOP_PHI').value || '',
    //   SO_TKHQ: document.getElementsByName('SO_TK_HQ')[0].value || '',
    //   TEN_DN: document.getElementsByName('TEN_DV_KHAI_BAO')[0].value || '',
    //   MA_DV_KHAI_BAO: document.getElementById('MA_DV_KHAI_BAO').value || '',
    //   MA_LOAI_THANH_TOAN:
    //     document.getElementsByName('MA_LOAI_THANH_TOAN')[0].value || '',
    //   MA_TRAM_TP: document.getElementById('MA_TRAM_TP').value || '',
    //   NGAY_TK_HQ: document.getElementsByName('NGAY_TK_HQTMP')[0].value || '',
    //   LOAI_TK_NP: document.getElementsByName('LOAI_TK_NP')[0].value || '',
    //   TONG_TIEN:
    //     parseInt(
    //       document
    //         .getElementsByClassName('SHOW_TIEN_TEXT text-right bold')[0]
    //         .innerHTML.match(/[0-9]/g)
    //         .join('')
    //     ) || 0,
    //   EINVOICE_LINK:
    //     document.getElementsByName('LINK_VIEW_EINVOICE')[0].value || '',

    //   SO_BIEN_LAI: document.getElementsByName('SO_BIEN_LAI')[0].value || '',
    // };

    console.log('INfo is: ', info);
    let currentList =
      JSON.parse(window.localStorage.getItem('danh_sach')) !== null
        ? JSON.parse(window.localStorage.getItem('danh_sach'))
        : [];
    // console.log('CurrentList: ', currentList);

    window.localStorage.setItem(
      'danh_sach',
      JSON.stringify(currentList.concat(info))
    );
  };

  /**
   * ! Condition to issue BL
   */
  const checkCondition = () => {
    // id = DBIENLAI_TPID
    const id = document.URL.replace('8221', '')
      .match(/[0-9]/g)
      .join('')
      .replace('10101020', '');
    // console.log(id);
    const data = new FormData();
    const data2 = new FormData();

    let invoiceNum = null;
    data.append('DBIENLAITPID', id);
    data.append('hasIssuedInvoice', 0);
    data2.append('DBIENLAITPID', id);

    let eInvoiceLink = '';

    try {
      //Check condition first
      setLoading(true);

      axios
        .post(
          'http://' +
            apiURL +
            ':8221/DBienLaiThuPhi/CheckConditionIssuedInvoice/',
          data,
          {
            headers: {
              __RequestVerificationToken: verificationToken,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log(res.data.code);
          if (res.data.code === 1) {
            return axios
              .post(
                'http://' +
                  apiURL +
                  ':8221/DBienLaiThuPhi/CheckConditionIssuedInvoice/',
                data2,
                {
                  headers: {
                    __RequestVerificationToken: verificationToken,
                  },
                  withCredentials: true,
                }
              )
              .then((res) => {
                console.log(res.data);
                invoiceNum = res.data.EINVOICE_OUT.InvoiceNumber;
                eInvoiceLink = res.data.EINVOICE_OUT.InvoiceKey;
                console.log(invoiceNum, eInvoiceLink);
                setBL(invoiceNum);
                if (invoiceNum !== null) {
                  setLoading(false);
                  const billInfo = {
                    TIME: new Date().toLocaleTimeString(),
                    DTOKHAINPID:
                      document.getElementsByName('DTOKHAINPID')[0].value || '',
                    SO_TK_NOP_PHI:
                      document.getElementById('SO_TK_NOP_PHI').value || '',
                    SO_TKHQ:
                      document.getElementsByName('SO_TK_HQ')[0].value || '',
                    TEN_DN:
                      document.getElementsByName('TEN_DV_KHAI_BAO')[0].value ||
                      '',
                    MA_DV_KHAI_BAO:
                      document.getElementById('MA_DV_KHAI_BAO').value || '',
                    MA_LOAI_THANH_TOAN:
                      document.getElementsByName('MA_LOAI_THANH_TOAN')[0]
                        .value || '',
                    MA_TRAM_TP:
                      document.getElementById('MA_TRAM_TP').value || '',
                    NGAY_TK_HQ:
                      document.getElementsByName('NGAY_TK_HQTMP')[0].value ||
                      '',
                    LOAI_TK_NP:
                      document.getElementsByName('LOAI_TK_NP')[0].value || '',
                    TONG_TIEN:
                      parseInt(
                        document
                          .getElementsByClassName(
                            'SHOW_TIEN_TEXT text-right bold'
                          )[0]
                          .innerHTML.match(/[0-9]/g)
                          .join('')
                      ) || 0,
                    EINVOICE_LINK:
                      eInvoiceLink ||
                      document.getElementsByName('LINK_VIEW_EINVOICE')[0].value,
                    SO_BIEN_LAI:
                      invoiceNum !== null
                        ? invoiceNum
                        : document.getElementsByName('SO_BIEN_LAI')[0].value,
                  };
                  console.log(billInfo);
                  let currentList =
                    JSON.parse(window.localStorage.getItem('danh_sach')) !==
                    null
                      ? JSON.parse(window.localStorage.getItem('danh_sach'))
                      : [];
                  // console.log('CurrentList: ', currentList);

                  window.localStorage.setItem(
                    'danh_sach',
                    JSON.stringify(currentList.concat(billInfo))
                  );
                }
              });
          } else {
            alert(res.data.message);
            setLoading(false);
          }
        });
    } catch (error) {
      alert(error.message);
    }
    return invoiceNum;
  };

  const CapNhatPage = () => {
    try {
      //Check if ten nguoi nop phi is empty then auto add name
      const name = document.getElementsByClassName('form-control input-sm')[2]
        .value;
      if (name == '') {
        document.getElementsByClassName('form-control input-sm')[2].value =
          'không có tên';
      }

      const TKHQ = document.getElementsByClassName(
        'form-control input-sm bold'
      )[1].value;

      const money = parseInt(
        document
          .getElementsByClassName('SHOW_TIEN_TEXT text-right bold')[0]
          .innerHTML.match(/[0-9]/g)
          .join('')
      ).toLocaleString('vi');

      const TEN_DN = document.getElementsByName('TEN_DV_KHAI_BAO')[0].value;

      return (
        <span style={{ display: isURL }}>
          <p />
          <div style={{ borderTop: '1px solid #ccc' }}></div>
          <p />
          <span style={{ fontWeight: 'bold' }}>
            {/* ------------------------ */}
            <span>
              Doanh nghiệp: <span style={{ color: 'red' }}>{TEN_DN} - </span>
            </span>
            {/* ------------------------ */}
            <span>
              Số TK Hải quan: <span style={{ color: 'red' }}>{TKHQ}</span>
            </span>
            {/* ------------------------ */}
            <span> - </span>
            {/* ------------------------ */}
            <span>
              Số tiền:
              <span style={{ color: 'red' }}> {money}</span>
            </span>
            &nbsp;&nbsp;
            <span>
              <Button
                id="one-click"
                onClick={() => checkCondition()}
                style={{
                  // display:
                  //   currentBL.length === 0 &&
                  //   document.getElementsByName('SO_BIEN_LAI')[0].value ===
                  //     '0000000'
                  //     ? ''
                  //     : 'none',
                  display: loading === false ? '' : 'none',
                }}
              >
                1-Click BL
              </Button>
            </span>
            <span>
              <BatmanRun loadingStatus={loading} />
            </span>
            <span
              style={{
                display: currentBL.length === 0 ? 'none' : '',
              }}
            >
              Số biên lai: <span style={{ color: 'red' }}>{currentBL}</span>
            </span>
            {/* <span style={{ color: 'white', fontWeight: 'normal' }}>
              <StyledA onClick={() => addTK2()} id="testButton">
                Test2
              </StyledA>
            </span> */}
          </span>
        </span>
      );
    } catch {
      return <></>;
    }
  };

  // const TAB = () => {
  //   return (
  //     <>
  //       {/* Tab Button */}
  //       <div className="tab">
  //         <button className="tablinks" onClick={openTab(evt, 'current')}>
  //           Current
  //         </button>
  //         <button className="tablinks" onClick={openTab(evt, 'all')}>
  //           All
  //         </button>
  //       </div>
  //       {/* Tab Content */}
  //       <CurrentPayment />
  //       <All />
  //     </>
  //   );
  // };

  // /**
  //  * ! Handle open TAB
  //  */
  // const openTab = (evt, id) => {
  //   let i, tabcontent, tablinks;
  //   try {
  //     tabcontent = document.getElementsByClassName('tabcontent');
  //     for (i = 0; i < tabcontent.length; i++) {
  //       tabcontent[i].style.display = 'none';
  //     }

  //     // Get all elements with class="tablinks" and remove the class "active"
  //     tablinks = document.getElementsByClassName('tablinks');
  //     for (i = 0; i < tablinks.length; i++) {
  //       tablinks[i].className = tablinks[i].className.replace(' active', '');
  //     }

  //     // Show the current tab, and add an "active" class to the button that opened the tab
  //     document.getElementById(id).style.display = 'block';
  //     evt.currentTarget.className += ' active';
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };

  const CurrentPayment = () => {
    return (
      <div style={{ display: correctURL }} id="current" className="tabcontent">
        <div>
          <ListDisplay />
        </div>
      </div>
    );
  };

  const All = () => {
    return (
      <div id="all" className="tabcontent">
        All content
      </div>
    );
  };

  /**
   * ! Main Components
   */

  return (
    <>
      <div style={{ display: correctURL }}>
        <div
          style={{
            display: 'block',
            minHeight: '100vh',
            border: '1px solid #ccc',
            // margin: '1em 0',
            borderRadius: '2px',
            padding: '5px',
          }}
        >
          <strong>Thu phí Extension - </strong>
          <strong style={{ color: 'red' }}>BETA</strong>
          <AddToKhai />
          <CurrentPayment />
        </div>
      </div>
      <CapNhatPage />
    </>
  );
};

//Render the element to Content page
const app = document.createElement('div');
cardBody.appendChild(app);
capnhatBody !== undefined ? capnhatBody.appendChild(app) : '';

ReactDOM.render(<ContentReact />, app);
