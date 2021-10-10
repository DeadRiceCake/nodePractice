const EventEmitter = require('events');

const myEvent = new EventEmitter();
myEvent.addListener('event1', () => {
    console.log( '이벤트1');
});
myEvent.on('event2', ()=>{
    console.log('이벤트2');
});
myEvent.on('event2', ()=>{
    console.log('이벤트2 추가');
});
myEvent.once('event3', ()=>{
    console.log('이벤트3');
});// 한번만 실행됨

const a= myEvent.emit('event1'); // 이벤트 호출
// console.log('a :', a);

myEvent.emit('event2'); // 이벤트 호출

myEvent.emit('event3'); // 이벤트 호출
myEvent.emit('event3'); // 실행 안됨

myEvent.on('event4', ()=>{
    console.log('이벤트4');
});
myEvent.removeAllListeners('event4'); // 이벤트 명이 적힌 모든 리스너 제거
myEvent.emit('event4'); // 실행 안됨

const listener = () =>{
    console.log('이벤트 5');
};
myEvent.on('event5', listener);
myEvent.removeListener('event5', listener); // 이벤트명이 적한 리스너 하나씩 제거(리스너도 적어야함)
myEvent.emit('event5'); // 실행 안됨

console.log(myEvent.listenerCount('event2'));// 이벤트 명으로 연결된 리스너 갯수