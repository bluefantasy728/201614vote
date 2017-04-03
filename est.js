let double = num=> num*2;
//如果参数不等于一个的话，才需要用小括号把参数包裹起来
console.log(double(2));


function ajax({url,type='GET'}){
    console.log(url,type)
}
ajax({url:'http',type:'POST'})


/*
let {url,type} = {url:'http',type:'GET'};
console.log(url,type);*/
