//把方法封装在此对象里
//取首页数据的偏移量
let offset = 90;
let limit = 10;
let total = 0;
//当前浏览器URL中的路径
let url = window.location.href;
let indexReg = /\/vote\/index/;//首页的正则
let registerReg = /\/vote\/register/;//注册页报名页的正则
const USER_KEY = 'user';
let voteFn = {
    //把用户数组转成li字符串
    formatUsers(users){
        //把对象数组转成li数组
        return users.map(user => (
            `
                    <li>        
                        <div class="head">
                           <a href="detail.html">
                              <img src="${user.head_icon}" alt="">
                           </a>
                        </div>
                        <div class="up">
                           <div class="vote">
                              <span>${user.vote}票</span>
                           </div>
                           <div class="btn">
                              投TA一票
                           </div>
                        </div>
                        <div class="descr">
                           <a href="detail.html">
                             <div>
                                <span>${user.username}</span>
                                <span>|</span>
                                <span>编号#${user.id}</span>
                              </div>
                              <p>${user.description}</p>
                           </a>
                        </div>     
                    </li>
                `
        )).join('');//最后拼接成一个大的字符串
    },
    //向服务器发起ajax请求
    request({url, type = 'GET', data = {}, dataType = 'json', success}){
        $.ajax({url, type, data, dataType, success})
    },
    //初始化首页数据
    initIndexData(){
        //向服务器发起请求首页的用户列表
        voteFn.request({
            url: `/vote/index/data?limit=${limit}&offset=${offset}`,
            success(result){
                //最新的偏移量应该加等于limit
                offset += limit;
                //总条数
                total = result.data.total;
                let users = result.data.objects;
                let html = voteFn.formatUsers(users);
                $('.coming').html(html);
            }
        });
        loadMore({
            //当拉到底部的时候会执行callback
            callback: function (load) {
                if (offset >= total) {
                    load.complete();
                    /*延时是为了更好的演示效果*/
                    setTimeout(function () {
                        load.reset();
                    }, 1000)
                } else {//如果偏移量小于最大条数，则需要继续加载
                    voteFn.request({
                        url: `/vote/index/data?limit=${limit}&offset=${offset}`,
                        success(result){
                            //最新的偏移量应该加等于limit
                            offset += limit;
                            let users = result.data.objects;
                            let html = voteFn.formatUsers(users);
                            setTimeout(function () {
                                $('.coming').append(html);
                                load.reset();
                            }, 1000)
                        }
                    });
                }
            }
        });
        let user = voteFn.getStorage(USER_KEY);
        user = JSON.parse(user);
        if(user){
            $('.register a').text('个人主页');
            $('.username').text(user.username);
            $('.no_signed').hide();
            $('.register a').attr('href','/vote/detail/'+user.id);
        }
        // 退出登录
        $('.dropout').click(function(){
            voteFn.clearStorage(USER_KEY);
            location.reload();
        });
        $('.mask').click(function(event){
            if(event.target.className == 'mask')
                $(this).hide();
        });
        $('.sign_in').click(function () {
            $('.mask').show();
        });
        $('.subbtn').click(function(){
            let id = $('.usernum').val();
            let password = $('.user_password').val();
            if(!id || !password){
                alert('用户名或密码不能为空');
                return;
            }
            voteFn.request({
                url:'/vote/index/info',
                type:'POST',
                data:{id,password},
                success(result){
                    console.log(result);
                    if(result.errno==0){
                        voteFn.setStorage(USER_KEY,JSON.stringify(result.user));
                        location.reload();
                    }else{
                        alert(result.msg);
                    }
                }
            })
        });
    },
    setStorage(key,value){
        localStorage.setItem(key,value);
    },
    getStorage(key){
        return localStorage.getItem(key);
    },
    clearStorage(key){
        localStorage.removeItem(key);
    },
    //初始化报名页
    initRegister(){
        $('.rebtn').click(function () {
            let username = $('.username').val();
            if(!username){
                alert('用户名不能为空');
                return;
            }
            let initial_password = $('.initial_password').val();
            let confirm_password = $('.confirm_password').val();
            if(!initial_password || !confirm_password || initial_password!=confirm_password|| !/^[0-9a-zA-Z]{1,10}$/.test(initial_password)){
                alert('密码不合法');
                return;
            }
            let mobile = $('.mobile').val();
            if(!mobile || !/^1\d{10}$/.test(mobile)){
                alert('手机号不正确');
                return;
            }
            let description = $('.description').val();
            if(!description || description.length>20){
                alert('自我描述不正确');
                return;
            }
            let gender = $('input[name="gender"]:checked').val();
            let user = {username,
                password:initial_password,
                mobile,
                description,
                gender
            }
            voteFn.request({
                url:'/vote/register/data',
                type:'POST',
                data:user,
                success(result){
                    if(result.errno == 0){
                        alert(result.msg);
                        user.id = result.id;
                        voteFn.setStorage(USER_KEY,JSON.stringify(user));
                        location = '/vote/index';
                    }
                }
            })
        });
    }
}
$(function () {
    //如果是首页
    if(indexReg.test(url)){
        voteFn.initIndexData();
        //则当前是报名页
    }else if(registerReg.test(url)){
        voteFn.initRegister();
    }
})