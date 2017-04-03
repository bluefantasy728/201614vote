//把方法封装在此对象里
//取首页数据的偏移量
let offset = 90;
let limit = 10;
let total = 0;
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
    request({url,type='GET',data={},dataType='json',success}){
         $.ajax({ url, type, data, dataType, success})
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
                console.log('total',total);
                let users = result.data.objects;
                let html = voteFn.formatUsers(users);
                $('.coming').html(html);
            }
        });
        //监听页面滚动
        window.onscroll = function(){
            //卷去的高度
            let scrollTop = document.documentElement.scrollTop|| document.body.scrollTop;
            //屏幕的高度
            let winHeight = document.documentElement.clientHeight ||   document.body.clientHeight;
            //内容的高度
            let contentHeight = document.documentElement.offsetHeight ||   document.body.offsetHeight;
            console.log('scroll');
            if(scrollTop+winHeight>=contentHeight){
                // total = 20   offset=10
                //如果偏移量大于等于最大条数，则表示全部加载完成
                if(offset>=total && total){
                    $('.loadmore').html('没有更多数据了')
                }else{//如果偏移量小于最大条数，则需要继续加载
                    voteFn.request({
                        url: `/vote/index/data?limit=${limit}&offset=${offset}`,
                        success(result){
                            //最新的偏移量应该加等于limit
                            offset += limit;
                            let users = result.data.objects;
                            let html = voteFn.formatUsers(users);
                           setTimeout(function(){
                               $('.coming').append(html);
                           },1000);
                        }
                    });
                }
            }
        }
    }
}
$(function () {
    voteFn.initIndexData();

})